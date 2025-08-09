import { createSchema, createYoga } from 'graphql-yoga';

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello from GraphQL Yoga',
      },
    },
  }),
  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
