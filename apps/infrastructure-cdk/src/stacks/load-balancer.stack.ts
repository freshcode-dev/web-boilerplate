import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
	ApplicationLoadBalancer, ApplicationProtocol, IApplicationLoadBalancer, ListenerAction, ListenerCertificate
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class LoadBalancerStack extends Stack {
	public readonly loadBalancer: IApplicationLoadBalancer;

	constructor(scope: Construct,
							id: string,
							applicationName: string,
							vpc: IVpc,
							certificateArn: string | undefined,
							props?: StackProps) {
		super(scope, id, props);

		const lbSgName = `${applicationName}-core-lb-sg`;
		const lbSecurityGroup = new ec2.SecurityGroup(this, lbSgName, {
			vpc,
			allowAllOutbound: true,
			description: 'Load balancer which restrict access from the web to the ',
			securityGroupName: lbSgName,
		});

		const certificateName = `${applicationName}-certificate`;
		const certificate = certificateArn?.length
			? Certificate.fromCertificateArn(this, certificateName, certificateArn)
			: undefined;

		const loadBalancerName = `${applicationName}-core-alb`;
		// will be better to get from another stack
		this.loadBalancer = new ApplicationLoadBalancer(this, loadBalancerName, {
			vpc,
			internetFacing: true,
			loadBalancerName,
			securityGroup: lbSecurityGroup
		});

		this.loadBalancer.applyRemovalPolicy(RemovalPolicy.DESTROY);

		const loadBalancerHttpsListenerName = `${applicationName}-https-listener`;
		this.loadBalancer.addListener(loadBalancerHttpsListenerName, {
			port: 443,
			certificates: certificate ? [ListenerCertificate.fromCertificateManager(certificate)] : [],
			protocol: ApplicationProtocol.HTTPS,
			defaultAction: ListenerAction.fixedResponse(404)
		});

		// const loadBalancerHttpListenerName = `${applicationName}-http-listener`;
		// this.loadBalancer.addListener(loadBalancerHttpListenerName, {
		// 	port: 80,
		// 	protocol: ApplicationProtocol.HTTP,
		// 	defaultAction: ListenerAction.redirect({ query: 'HTTPS://#{host}:443/#{path}?#', permanent: true })
		// });

		new CfnOutput(this, 'coreAlbArn', { value: this.loadBalancer.loadBalancerArn, exportName: 'coreAlbArn' });
	}
}
