
<!-- monorepo architecture -->
<!-- create a nest project -->
nest new ykp-grpc

<!-- for adding microservice package -->
npm i @nestjs/microservices

<!-- for kafka -->
npm i @nestjs/microservices kafkajs

<!-- for grpc -->
npm i @grpc/grpc-js @grpc/proto-loader @nestjs/microservices


<!-- for create workspace -->
npx create-nx-workspace@latest ykp-grpc

<!-- nx used for nest application for creating monorepo -->
npm i -D @nx/nest

<!-- for create application -->
npx nx g @nx/nest:application auth-service --project-name=auth-service --bundler=webpack
npx nx g @nx/nest:application order-service --project-name=order-service --bundler=webpack
npx nx g @nx/nest:application payment-service --project-name=payment-service --bundler=webpack
npx nx g @nx/nest:application checkout-service --project-name=checkout-service --bundler=webpack

<!-- serve single application -->
npx nx serve checkout-service

<!-- this command will run both applications -->
npx nx serve-many --projects=auth-service,order-service

<!-- for grpc -->
npm i @grpc/grpc-js @grpc/proto-loader @nestjs/microservicess


rxjs -> It is safer: If a connection stays open and the observable doesn't complete immediately, firstValueFrom resolves as soon as the response arrives. lastValueFrom would hang waiting for the stream to complete.
Immediate retrieval: In multi-value streaming (such as gRPC Server Streaming), firstValueFrom lets you grab the very first emission instantly

service discovery
1. grpc -> service discovery -> eureka 
microserivec communicaton
load balancer failover
multiservice cloud delpoyement



consul 
service registry and discovery tool
health check for service
supports service to service discovery