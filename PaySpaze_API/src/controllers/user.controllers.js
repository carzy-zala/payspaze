import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//#region Token genration

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "ERROR :: Something went wrong while generating your token !"
    );
  }
};

//#endregion

//#region  Register user

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field.trim === "")) {
    throw new ApiError(
      400,
      "ERROR :: All fields name,email and password are compalsory !!"
    );
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(
      400,
      "ERROR :: Your email is already register with us !"
    );
  }

  const user = await User.create({
    name: name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(
      500,
      "ERROR :: Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

//#endregion

//#region  Login user

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "ERORR :: Please enter credentials properly !!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      405,
      "ERROR :: You are not register with us ! Please register !!"
    );
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "ERROR :: Invalid credentials !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        `Welcome , ${loggedInUser.name.toUpperCase()}`
      )
    );
});

//#endregion

//#region logout

export const logout = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, {}, "User logout succesfully !"));
});

//#endregion

//#region make Payment

export const makePayment = asyncHandler(async (req, res) => {
  const { to, from, amount } = req.body;
  const { _id, email, eth, btc } = req.user;

  if (email === to) {
    throw new ApiError(400, "ERORR :: Self Transfer not allowed !!");
  }

  if ([to, from, amount].some((field) => field.trim() === "")) {
    throw new ApiError(400, "ERORR :: Please enter all details !!");
  }

  const user = await User.findOne({ email: to });

  if (!user) {
    throw new ApiError(405, "ERROR :: Please enter valid reciever !!");
  }

  if (
    (from === "BTC" && parseInt(amount) > parseInt(btc)) ||
    (from === "ETH" && parseInt(amount) > parseInt(eth))
  ) {
    throw new ApiError(405, "ERROR :: Insufficient balance !!");
  }

  const loggedInUser = await User.findById(_id);

  if (from === "BTC") {
    loggedInUser.btc = (parseInt(btc) - parseInt(amount)).toString();
    user.btc = (parseInt(user.btc) + parseInt(amount)).toString();
  } else {
    loggedInUser.eth = (parseInt(eth) - parseInt(amount)).toString();
    user.eth = (parseInt(user.eth) + parseInt(amount)).toString();
  }

  loggedInUser.save();
  user.save();

  const newUser = await User.findById(loggedInUser._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, { user: newUser }, "Payment successfully"));
});

//#endregion
