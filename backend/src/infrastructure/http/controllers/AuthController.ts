import { Request, Response } from 'express';
import { database } from '../../database/sqlite';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const existingUser = await database('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    // Salva a senha sem hash (texto puro)
    await database('users').insert({ email, password });

    res.json({ message: 'Usuário cadastrado com sucesso!' });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
  
    const user = await database('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
  
    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }
  
    // Agora também retornamos o ID do usuário
    res.json({
      message: 'Login realizado com sucesso!',
      userId: user.id
    });
  }  
}
