# Infrastructure and Deployment

The infrastructure for this project is fully managed by the AWS CDK stacks
defined in `infrascructure-cdk` project. Which means, most constant changes 
that need to be applied to the infrastructure have to be defined through one 
of the `infrascructure-cdk` project stacks.

The entrypoint to the infrastructure definition is `infrastructure-cdk/src/main.ts`. 

All the stacks defined there are deployable with the next command: 
```bash
nx deploy infrastructure-cdk [stack-name]
```

## Deploying regular updates to existing environments
Each environment has its own delivery flow. All the deployments happen automatically, and usually, 
don't require user to do anything except for observing and fixing possible errors.

Pipelines deploy both codebase and infrastructure updates. When pipeline passes, it means, the
environment is now completely up to date with the repository.

### Dev environment
Deploys automatically, every time any changes reach `main` branch

### Staging
Deploys when `web-0.0.0-staging-0` tag is created.

### Production
Deploys when `web-0.0.0` tag is created.


## Environment variables
By default, the deployment pipeline takes the environment variables from `.env` 
files of each project.

If any environment variable needs to have a different value on some environment, you
have to set it specifically on
`infrastructure-cdk/src/environments/[env name].environment.ts/ecsEnvironmentVariables`

All the changes to these files will be applied to the corresponding environments 
automatically during the next deployment.

## SSL Certificates
All the application environments should use the aws-managed wildcard certificate, which 
**renews automatically**.

However, if for some reason you need to replace it with some specific certificate, follow the next steps:
1. Open `AWS Certificates Manager` service
2. Issue or import a new certificate
3. Verify it
4. Copy the certificate's ARN, and set the `NX_CERTIFICATE_ARN` environment variable 
of the `infrastructure-cdk` project with the copied ARN
5. Redeploy the ALB stack (described below)


## Credentials and accesses
By default, deployment scripts use the default access+secret pair of credentials 
configured for the `AWS CLI` setup.

However, to be more safe, when deploying CDK manually, I recommend to use named profiles instead of default 
ones, and use it with the `--profile` option like this:
```bash
nx deploy infrastructure-cdk [stack-name] --profile=[profile name]
```

Also, for this exact project (as well as all the outsource projects), we use us-east-2 region, so make sure, your profile
is defaulted to it.

*Previously configured profiles can be checked with the next command:*
```bash
aws configure list-profiles
```
To configure new profile, use the next command:
```bash
aws configure --profile=[new profile name]
```

## Complete deployment of the app to the new account/region
1. Deploy SES identity for sending emails
```bash
nx deploy infrastructure-cdk barva-ses-stack
```
2. Deploy ALB for routing traffic to all the environments (or reuse some of existing load balancers)
```bash
nx deploy infrastructure-cdk barva-alb-stack
```
3. Make sure the stage you want to deploy is defined in the `./src/environments` folder 
(including its `index.ts` file)
4. Add the corresponding jobs to the `./misc/.gitlab-ci.yml`, based on the `.web-deployment-job`
5. Trigger the job and observe the progress
6. When the environment is set up, you can make ALB serving subdomain traffic to the 
exact ECS Service by [adding a corresponding `CNAME` record to your DNS settings](https://stackoverflow.com/a/58314267).

## Manual infrastructure deployment
Even when manual deployment should be avoided in most cases, you still can do it when needed.

The full set of scripts of deploying the stage is described in
`./misc/.gitlab-ci.yml/.web-deployment-job`. Some steps (like building fresh images, parsing output values, or any other) can
be optionally skipped.

***
## Parts of the infrastructure
### Core load balancer `shared` `manual`
###### *Should be executed manually once per project, or to apply some changes*
*Shared across all the environments*

To not overpay for a separate load-balancer for each environment, we created the 
core one, and reuse it for all the environments.

The core load-balancer is managed by the `barva-alb-stack` (`./stacks/load-balancer.stack.ts`)

To modify the load balancer in any way, it's highly recommended to update the code of this 
stack an apply the changes by running: 
```bash
nx deploy infrastructure-cdk barva-alb-stack
```
***

### Managed SES identity `shared` `manual`
###### *Should be executed manually once per project, or to apply some changes*
*Shared across all the environments*

To send emails from the backend, we use `AWS SES` service. To prevent unnecessary 
verifications, we have only one domain-based identity. This approach allows to send 
emails from any email addresses of this domain, which is perfect for multistage 
environment.

Deployment command:
```bash
nx deploy infrastructure-cdk barva-ses-stack
```
***

### ECR Registry `per-stage` `auto-deploy`
###### *Included into the CI/CD process. Applies changes on every deployment*
Stores `Docker` images of the app. Mostly used as a source of images when deploying 
corresponding `ECS` service.

Outputs references to the created repository. Repository names are always calculated
based on stage name, so single environment should have only one ECR repository per ECS 
service.

To deploy manually, the following command can be used. **However, it's not recommended**
```bash
nx deploy infrastructure-cdk barva-[stage]-ecr-stack
```

### Main set of resources `per-stage` `auto-deploy`
###### *Included into the CI/CD process. Applies changes on every deployment*
Most of stage-unique resources are defined in the `Main Stack`. At the moment of writing 
this article, the stack includes:
- RDS
- Secret Manager entry with database-related data
- ECS Service with Fargate task
- Security Group for DB and backend
- Target Group
- ALB listener rule (which attaches itself to the `Core ALB`)
- S3 Bucket
- Elemental Media Convert role definition

Any of the following resources should only be changed by updating the IaaC template.

References to external resources, or any other external values are defined in 2 ways:
1. Stages settings (`./src/environments`). Typed way of setting stage parameters 
defining different aspects of each environment
2. Environment variables (`./.env`). Mostly used for variables that might be passed 
from the outside (e.g. from the CI/CD pipeline) 

To deploy manually, the following command can be used. **However, it's not recommended**
```bash
nx deploy infrastructure-cdk barva-[stage]-stack
```

## Where to find the deployed infrastructure
All the stacks we define and deploy with the AWS CDK become `Cloud Formation` stacks, 
and can be found in the corresponding service UI.

Each stack contain a full set of related resources.

When removing stacks, Cloud Formation tries to remove any related resources, so 
be aware of it. 
