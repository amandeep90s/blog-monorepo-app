export interface GraphQLContext {
  req: {
    user: {
      id: string;
      email?: string;
    };
  };
}
