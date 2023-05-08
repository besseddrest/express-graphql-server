const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const app = express();

const musicians = [
  { id: 1, name: "Joe Dart" },
  { id: 2, name: "Flea" },
];

const songs = [
  { id: 1, name: "Flyers Direct", musicianId: 1 },
  { id: 2, name: "Blood Sugar Sex Magic", musicianId: 2 },
  { id: 3, name: "Deantown", musicianId: 1 },
  { id: 4, name: "Suck My Kiss", musicianId: 2 },
  { id: 5, name: "It Gets Funkier", musicianId: 1 },
  { id: 6, name: "Californication", musicianId: 2 }
];

const MusicianType = new GraphQLObjectType({
  name: 'Musician',
  description: 'This represents a musician of a song',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) }
  })
})

const SongType = new GraphQLObjectType({
  name: 'Song',
  description: 'This represents a song played by a musician',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    musicianId: { type: GraphQLNonNull(GraphQLString) },
    musician: {
      type: MusicianType,
      resolve: (song) => {
        return musicians.find(musician => musician.id === song.musicianId)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    songs: {
      type: new GraphQLList(SongType),
      description: 'List of Songs',
      resolve: () => songs 
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));
app.listen(5000, () => console.log("Server Running"));