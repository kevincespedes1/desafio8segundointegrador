import UserModel from '../dao/models/user.model.js'

export class UserController {
    constructor() {
    }

    async getUsers() {
        try {
            const users = await UserModel.find().lean()
            return users
        } catch (err) {
            return err.message
        }
        
    }

    async getUsersPaginated(page, limit) {
        try {
            return await UserModel.paginate(
                { rol: 'usuario' },
                { offset: (page * 1) - 0, limit: 5, lean: true }
            )
        } catch (err) {
            return err.message
        }
    }
}