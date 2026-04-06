function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isBlocked: user.isBlocked,
    isDonor: user.isDonor,
    upozila: user.upozila,
    mobile: user.mobile,
    bloodGroup: user.bloodGroup,
    age: user.age,
    photo: user.photo,
    donated: user.donated,
    lastDonationDate: user.lastDonationDate,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  serializeUser,
};
