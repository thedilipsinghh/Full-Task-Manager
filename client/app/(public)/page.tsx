"use client"
import { useSigninMutation } from '@/redux/apis/auth.api'
import { SIGNIN_REQUEST } from '@/types/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const Login = () => {
    const [signin, { isLoading }] = useSigninMutation()
    const router = useRouter()

    const loginSchema = z.object({
        email: z.string().min(1).email(),
        password: z.string().min(1),
    }) satisfies z.ZodType<SIGNIN_REQUEST>

    const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm<SIGNIN_REQUEST>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginSchema)
    })

    const handleLogin = async (data: SIGNIN_REQUEST) => {
        try {
            const { result } = await signin(data).unwrap()
            toast.success("Login success")
            reset()

            if (result.role === "admin") {
                router.push("/admin")
                router.refresh()
            } else {
                router.push("/employee")
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            toast.error("unable to login")
        }
    }
    const handleClasses = (key: keyof SIGNIN_REQUEST) => clsx({
        "form-control my-2": true,
        "is-invalid": errors[key],
        "is-valid": touchedFields[key] && !errors[key],
    })

    return <>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit(handleLogin)}>
                                <div>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        placeholder='email@example.com'
                                        className={handleClasses("email")} />
                                    <div className="invalid-feedback">{errors && errors.email?.message}</div>
                                </div>
                                <div>
                                    <input
                                        {...register("password")}
                                        type="password"
                                        placeholder='************'
                                        className={handleClasses("password")} />
                                    <div className="invalid-feedback">{errors && errors.password?.message}</div>
                                </div>
                                <button disabled={isLoading} className='btn btn-lg btn-primary mt-2 w-100'>
                                    {
                                        isLoading
                                            ? <span className='spinner spinner-border'></span>
                                            : "Login"
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Login