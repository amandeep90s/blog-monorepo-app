import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Using ApolloDriver for GraphQL
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // Updated path to 'src/graphql/schema.gql'
      graphiql: true, // Enable GraphiQL interface
      sortSchema: true, // Sort the schema for better readability
    }),
    PrismaModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
