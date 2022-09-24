import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User[] {
	const user = this.usersRepository.findById(user_id);

	if(!user){
		throw new Error("Usuario não encontrado");;
	}

	if( !user.admin){
		throw new Error("Usuario sem permissão");;
	}

	const users = this.usersRepository.list();

	return users;
}
}

export { ListAllUsersUseCase };
