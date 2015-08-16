import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Item,
  likeItem,
  getItem,
  getItems
} from './database';


class Page extends Object {

}

const home = new Page();
home.id = 'home';

const {nodeInterface, nodeField} = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Page') {
      return home;
    } else if (type === 'Item') {
      return getItem(id);
    } else {
      return null;
    }
  },
  obj => {
    if (obj instanceof Item) {
      return itemType;
    } else if (obj instanceof Page) {
      return pageType;
    } else {
      return null;
    }
  }
);

const pageType = new GraphQLObjectType({
  name: 'Page',
  fields() {
    return {
      id: globalIdField('Page'),
      items: {
        type: itemsConnection,
        async resolve(_, args) {
          const items = await getItems();
          return connectionFromArray(items, args);
        }
      }
    };
  }
});


const itemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    id: globalIdField('Item'),
    name: {
      type: GraphQLString
    },
    likes: {
      type: GraphQLInt
    }
  }),
  interfaces: [nodeInterface],
});


const {connectionType: itemsConnection} = connectionDefinitions({
  name: 'Item',
  nodeType: itemType
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    home: {
      type: pageType,
      resolve() {
        return home;
      }
    }
  }),
});


const LikeItemMutation = mutationWithClientMutationId({
  name: 'LikeItem',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    item: {
      type: itemType,
      resolve({itemId}) {
        return getItem(itemId);
      }
    }
  },

  async mutateAndGetPayload({id}) {
    const itemId = fromGlobalId(id).id;
    await likeItem(itemId);
    return {itemId};
  }

});


const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    likeItem: LikeItemMutation
  }),
});


export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
