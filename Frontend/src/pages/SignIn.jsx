import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useToast } from '../components/ToastProvider';
import { authService } from '../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-6 sm:py-8">
      <AuthForm
        initialMode="register"
        onBack={() => navigate('/')}
        onRegister={(formData) => authService.register(formData)}
        onVerifyRegistration={async (payload) => {
          await authService.verifyRegistration(payload);
          toast.success('Account created successfully.');
          navigate('/profile', { replace: true });
        }}
        onLogin={async (formData) => {
          const session = await authService.login(formData);

          if (session.role === 'admin') {
            toast.success('Admin login successful.');
            navigate('/admin', { replace: true });
            return;
          }

          toast.success('Logged in successfully.');
          navigate('/profile');
        }}
        onForgotPassword={(payload) => authService.requestPasswordReset(payload)}
        onResetPassword={async ({ token, newPassword, rememberMe }) => {
          await authService.resetPassword({ token, newPassword, rememberMe });
          toast.success('Password reset successfully.');
          navigate('/profile');
        }}
      />
    </div>
  );
};

export default SignIn;
