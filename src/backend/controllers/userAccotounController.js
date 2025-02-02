const UserAccount= require('../models/userAccount')

const insertUserAccount = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER inserUserAccount=======\n")
        console.log(req.body)
        
        const newUserAccount= new UserAccount(req.body)
        const savedUserAccount= await newUserAccount.save()

        res.status(200).json(savedUserAccount)
    } catch (error) {
        console.log("Erro ao cadastrar usuario: ", error)
        res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }

}

const userLoginAttempt= async (req, res) => {


    try {

    } catch (error) {
        console.log("Erro ao logar: ", error)
        res.status(500).json({ message: "Erro ao logar" });
    }
}

const getUserAccounts = async (req, res) => {
    try {
        const userAccounts= UserAccount.find()
        res.status(200).json(userAccounts)
    } catch (error) {
        console.log("Erro ao inserir comentario: ", error)
        res.status(500).json({ message: "Erro ao inserir comentario" });
    }
}


module.exports= {
    insertUserAccount,
    userLoginAttempt,
    getUserAccounts
}