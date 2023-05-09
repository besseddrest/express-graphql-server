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
    name: { type: GraphQLNonNull(GraphQLString) },
    songs: {
      type: new GraphQLList(SongType),
      resolve: (musician) => {
        return songs.filter(song => song.musicianId === musician.id)
      }
    }
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
      resolve: (songs) => {
        return musicians.find(musician => musician.id === songs.musicianId)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    song: {
      type: SongType,
      descriptioon: 'A single song by bass player',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => songs.find(song => song.id === args.id)
    },
    songs: {
      type: new GraphQLList(SongType),
      description: 'List of Songs',
      resolve: () => songs 
    },
    musicians: {
      type: new GraphQLList(MusicianType),
      description: 'List of Bass Players',
      resolve: () => musicians
    },
    musician: {
      type: MusicianType,
      description: 'One bass player',
      args: {
        name: { type: GraphQLString}
      },
      resolve: (parent, args) => musicians.find(musician => musician.name === args.name)
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