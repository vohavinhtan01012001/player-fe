import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { PlayerService } from '../../../../services/playerService';
import { AuthService } from '../../../../services/authService';

export type LoginForm = {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await AuthService.login(data)
      if (res.data.accessToken) {
        if (res.data.data.status != 0) {
          const players = await PlayerService.getPlayers();
          const user = res.data.data;
          const checkPlayer = players.data.data.find((item: any) => item.userId === user.id);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          checkPlayer ? localStorage.setItem("isPlayer", "true") : localStorage.setItem("isPlayer", "false");
          localStorage.setItem('accessToken', res.data.accessToken)
          if (res.data.data.role === 1) {
            navigate('/admin/users')
          }
          else {
            navigate('/')
          }
          window.location.reload()
          toast.success(res.data.msg)
        }
        else {
          toast.error("Account has been locked")
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label className='text-base' required>Email</Label>
      <Input
        type='email'
        {...register('email')}
        errorMessage={errors.email?.message}
      />
      <Label className='text-base' required>Password</Label>
      <Input
        type='password'
        {...register('password')}
        errorMessage={errors.password?.message}
      />
      <button type='submit'>Sign In</button>
      <Link to={'/forgot-password'} className='text-sm hover:text-red-600'>Forgot Password?</Link>
    </form>
  );
}

export default Login;
