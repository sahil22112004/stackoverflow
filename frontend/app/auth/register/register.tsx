'use client'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, InputAdornment, IconButton, MenuItem } from "@mui/material";
import * as z from "zod";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, githubprovider, googleProvider } from "../../firebase/firrebase";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
// import { googleLogin, registerUser } from "@/app/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import './register.css';
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { googleLogin, registerUser } from "../../redux/slices/authSlice";

function Register() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();
    const [showPassword, setShowPassword] = useState(false);
    const { isLoggedIn, currentUser, loading } = useSelector((state: RootState) => state.auth);

    const signupSchema = z.object({
        username: z.string().min(1, "User Name is required"),
        email: z.string().min(1, { message: "Email is required." }).email("Invalid email address."),
        password: z.string().trim().min(6, "Password must be at least 6 characters"),
    });

    type SignupForm = z.infer<typeof signupSchema>;

    const { control, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: { username: "", email: "", password: "" },
    });


    const onSubmit = async (user: SignupForm) => {
        console.log('working')
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                user.email,
                user.password
            );
            const firebaseUser = userCredential.user;
            const User = {
                username: user.username,
                email: firebaseUser.email
            }
            try {
                await dispatch(registerUser(User))
                enqueueSnackbar("Registered Successfully!", { autoHideDuration: 3000 });
                router.push('/auth/login')

            } catch (error:any){
                enqueueSnackbar(error.message, { autoHideDuration: 3000 });

            }
            console.log(firebaseUser)

        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error.message, { autoHideDuration: 3000 });
        }
    };

    const googleSign = async () => {
        try {
            const firebaseUser = (await signInWithPopup(auth, googleProvider)).user;
            console.log(firebaseUser)

            const User = {
                username: firebaseUser.displayName,
                email: firebaseUser.email
            }
            try {
                await dispatch(googleLogin(User))
                router.push('/dashboard')
                enqueueSnackbar("Google Login Success!", { variant: "success" });

            } catch (error: any) {
                console.log(error)
                enqueueSnackbar(error, { variant: "error" });

            }
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar(error, { variant: "error" });
        }

    };

    const githubSign = async () => {
        try {
            const firebaseUser = (await signInWithPopup(auth, githubprovider));
            console.log(firebaseUser)
            const User = {
                username: firebaseUser.user.displayName,
                email: firebaseUser.user.email
            }

            try {
                await dispatch(googleLogin(User))
                router.push('/dashboard')
                enqueueSnackbar("Github Login Success!", { variant: "error" });

            } catch (error: any) {
                console.log(error)
                enqueueSnackbar(error, { variant: "error" });

            }
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar(error, { variant: "error" });

        }
    };

    return (
        <div className="register-outer">
            <div className="register-container">


                <div className="register-right">
                    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    placeholder="Enter Username"
                                    // variant="standard"
                                    fullWidth
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                    className="register-input"
                                />
                            )}
                        />

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    placeholder="Enter Email"
                                    // variant="filled"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    className="register-input"
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    placeholder="Enter Password"
                                    type={showPassword ? "text" : "password"}
                                    // variant="filled"

                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    className="register-input"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(p => !p)}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />

                        <Button type="submit" fullWidth className="register-btn">
                            Sign Up
                        </Button>

                        <Typography className="register-or">OR</Typography>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={googleSign}
                            className="google-btn"
                        >
                            Signup with Google
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GitHubIcon />}
                            onClick={githubSign}
                            className="github-btn"
                        >
                            Signup with GitHub
                        </Button>

                        <Typography className="register-login-text">
                            Already have an account? <Link href="/auth/login">Login</Link>
                        </Typography>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default Register;


