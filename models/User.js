class User {
    constructor(id, first, last, phone, mail, place, pictureUrl) {
        this.id = id;
        this.firstName = first;
        this.lastName = last;
        this.phoneNumber = phone;
        this.email = mail;
        this.currentResidence = place;
        //this.profilePicture = pictureUrl
        //TODO - chat socket ako je aktivan trenutno
    }
}

export default User;