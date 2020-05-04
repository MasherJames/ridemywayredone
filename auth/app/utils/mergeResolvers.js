const mergeResolvers = (...resolvers) => {
  const mergedResolvers = {};
  resolvers.forEach((resolver) => {
    for (let key in resolver) {
      if (resolver.hasOwnProperty(key)) {
        mergedResolvers[key] = { ...mergedResolvers[key], ...resolver[key] };
      }
    }
  });
  return mergedResolvers;
};
export default mergeResolvers;
