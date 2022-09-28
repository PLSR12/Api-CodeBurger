import * as Yup from 'yup'
import Category from '../models/Category'
import Product from '../models/Product'
import User from '../models/User'

class ProductController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { filename: path } = request.file
    const { name, price, category_id, offer } = request.body

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
    })

    return response.json(product)
  }

  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return response.json(products)
  }

  async show(request, response) {
    const { id } = request.params

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    if (!product) {
      return response.status(401).json({
        error: 'articles not found, verify your articles Id is correct.',
      })
    }

    return response.json(product)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { id } = request.params

    const productId = await Product.findByPk(id)

    if (!productId) {
      return response.status(401).json({
        error: 'Product not found, verify your product Id is correct.',
      })
    }

    let path
    if (request.file) {
      path = request.file.filename
    }

    const { name, price, category_id, offer } = request.body

    const product = await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },

      { where: { id } }
    )
    return response.json(product)
  }

  async delete(request, response) {
    const id = request.params.id

    const productId = await Product.findByPk(id)

    if (!productId) {
      return response.status(401).json({
        error: 'product not found, verify your product Id is correct.',
      })
    } else {
      await Product.destroy({ where: { id } })
      response.status(200).json({ message: 'Deleted successfully' })
    }
  }
}

export default new ProductController()
