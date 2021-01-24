import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as lambda from '@aws-cdk/aws-lambda'
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as fs from 'fs';
import { SecretValue } from '@aws-cdk/core';

// TODO not here
const DEFAULT_DB_USER = "admin"
const DEFAULT_DB_PASSWORD = "password"

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "rzr-VPC")
    
    const entrySG = new ec2.SecurityGroup(this, "rzr-EntrySSG", {
      vpc: vpc,
    })
    
    const databaseSG = new ec2.SecurityGroup(this, "rzr-DBSSG", {
      vpc: vpc,
      allowAllOutbound: true
    })
    databaseSG.addIngressRule(entrySG, new ec2.Port({protocol: ec2.Protocol.ALL, stringRepresentation: "Allow EntrySG In"}))
    
    
    const database = new rds.DatabaseInstance(this, "rzr-DB", {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_21,
      }),
      securityGroups: [databaseSG],
      vpc: vpc,
      credentials: rds.Credentials.fromPassword(DEFAULT_DB_USER, SecretValue.plainText(DEFAULT_DB_PASSWORD))
    })
    
    
    const documentBucket = new s3.Bucket(this, 'rzr-Documents', {
      versioned: true,
    })
    
    // const wordpressEC2 = new ec2.Instance(this, "Razer-Wordpress", {
    //   vpc: vpc,
    //   instanceType: new InstanceType(ec2.InstanceSize.NANO),
    //   machineImage: ec2.MachineImage.latestAmazonLinux(),
    //   securityGroup: entrySG,
    // })
    
    const lambdaHandler = new lambda.Function(this, "rzr-Lambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("../api/app.zip"),
      handler: 'dist/serverless',
      securityGroups: [entrySG],
      environment: {
        BUCKET: documentBucket.bucketName,
      }
    })
    documentBucket.grantReadWrite(lambdaHandler)
    
    
    const api = new apigateway.RestApi(this, "rzr-API", {
      restApiName: "API Service",
      description: "This service serves the scheduling backend."
    });
    
    const getWidgetsIntegration = new apigateway.LambdaIntegration(lambdaHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    
    api.root.addMethod("GET", getWidgetsIntegration); // GET /
    
    // api.addDomainName()
    
    
    
    const frontendBucket = new s3.Bucket(this, 'rzr-React', {
      versioned: true,
      websiteIndexDocument: "index.html",
      publicReadAccess: true
    })
    
    const fileName = "./.env"
    fs.writeFile(fileName, `API_URL=${api.url}`, (e) => {})
    // s3deploy.Source.asset(fileName)
    new s3deploy.BucketDeployment(this, 'rzr-ReactDeployment', {
      sources: [s3deploy.Source.asset('../frontend/app.zip') ],
      destinationBucket: frontendBucket,
      // destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
    })
  }
}