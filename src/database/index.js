import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import User from '../app/models/User'
import Product from '../app/models/Product'
import Category from '../app/models/Category'

import configDataBase from '../config/database'

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(configDataBase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/mongo',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  }
}

export default new Database()
