import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
}

export async function checkPassword(password, savedPass) {
  try {
    const isMatch = await bcrypt.compare(password, savedPass);

    return isMatch;
  } catch (error) {
    console.log(error);
  }
}
