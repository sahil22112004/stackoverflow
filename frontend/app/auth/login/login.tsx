'use client'

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubprovider, googleProvider } from '../../firebase/firrebase';
import Link from 'next/link'
// import { googleLogin, loginUser } from '../../redux/slices/authSlice';
import './login.css';
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { loginUser, registerUser } from '../../redux/slices/authSlice';

function Login() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false);
//   const { isLoggedIn, currentUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  const singupschema = z.object({
    email: z.string().min(1, 'Email is required').email("Invalid email format."),
    password: z.string().trim().min(1, 'Password is required').min(4, 'Password must be at least 4 characters'),
  });

  type loginInterface = z.infer<typeof singupschema>

  const { control, handleSubmit, formState: { errors } } = useForm<loginInterface>({
    resolver: zodResolver(singupschema),
    defaultValues: { email: '', password: '' },
  });

//   useEffect(() => {
//     if (isLoggedIn && currentUser) {
//       router.push("/dashboard");
//     }
//   }, [isLoggedIn, currentUser, router]);

 const onSubmit = (user: loginInterface) => {

    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        console.log(userCredential)
        const user ={
            email:userCredential.user.email
        }
        try{
            dispatch(loginUser(user))
            router.push('/dashboard')
            enqueueSnackbar("Login Success!", { variant: "error" });
        }catch(error:any){
            console.log(error)
             enqueueSnackbar(error, { variant: "error" });
        }


      })
      .catch((error :any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });

  }

    const googleSign = async () => {
        try {
            const firebaseUser = (await signInWithPopup(auth, googleProvider)).user;
            console.log(firebaseUser)

            const User = {
                username: firebaseUser.displayName,
                email: firebaseUser.email
            }
            try {
                await dispatch(registerUser(User))
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
                await dispatch(registerUser(User))
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
    <div className="login-outer">
      <div className="login-container">
        <div className="login-right">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter Email "
                //   variant="filled"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="login-input"
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
                //   variant="filled"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="login-input"
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

            <Button type="submit" fullWidth className="login-btn">
              Login
            </Button>

            <Typography className="login-or">OR</Typography>

            <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={googleSign}
                            className="google-btn"
                        >
                            Login with Google
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GitHubIcon />}
                            onClick={githubSign}
                            className="github-btn"
                        >
                            Login with GitHub
                        </Button>

            <Typography className="signup-text">
              New to Stack OverFlow? <Link href="/auth/register">Create an account</Link>
            </Typography>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;