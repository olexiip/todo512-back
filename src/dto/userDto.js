class UserDTO {
    email;
    id;
    isActivated;
    userName;
    roles;

    constructor(model) {
        this.email=model.email;
        this.id=model._id;
        this.isActivated=model.isActivated;
        this.userName = model.userName;
        this.roles = model.roles;
        this.userSurname = model.userSurname;
    }
}

export default UserDTO;