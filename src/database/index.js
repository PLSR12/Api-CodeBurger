import mongoose from 'mongoose'
import Sequelize from 'sequelize'

import Category from '../app/models/Category'
import Product from '../app/models/Product'
import User from '../app/models/User'

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
      'mongodb://mongo:nH9kYSfdL4BgD66IQrsU@containers-us-west-77.railway.app:7726',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  }
}

export default new Database()
