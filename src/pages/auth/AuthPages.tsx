// UniMatch Phase 2: Authentication Pages
// Login, Signup, and Profile pages

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthTabs, UserProfile } from '../components/auth/AuthComponents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'

// =============================================
// LOGIN PAGE
// =============================================

export const LoginPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const handleLoginSuccess = (data) => {
    // Redirect to dashboard after successful login
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">UniMatch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your gateway to university success
          </p>
        </div>
        
        <AuthTabs onSuccess={handleLoginSuccess} />
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================
// SIGNUP PAGE
// =============================================

export const SignupPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const handleSignupSuccess = (data) => {
    // Show success message and redirect to login
    navigate('/login?message=Account created successfully! Please check your email to verify your account.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Join UniMatch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start your university journey
          </p>
        </div>
        
        <AuthTabs onSuccess={handleSignupSuccess} />
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================
// PROFILE PAGE
// =============================================

export const ProfilePage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <UserProfile />
      </div>
    </div>
  )
}

// =============================================
// PASSWORD RESET PAGE
// =============================================

export const PasswordResetPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const handleResetSuccess = () => {
    // Show success message and redirect to login
    navigate('/login?message=Password reset email sent! Please check your inbox.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        <AuthTabs onSuccess={handleResetSuccess} />
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================
// EMAIL VERIFICATION PAGE
// =============================================

export const EmailVerificationPage = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      if (user.email_confirmed_at) {
        navigate('/dashboard')
      }
    }
  }, [user, loading, navigate])

  const handleResendVerification = async () => {
    // Implement resend verification logic
    console.log('Resend verification email')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (user.email_confirmed_at) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to your email address
          </p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              Please check your email ({user.email}) and click the verification link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or request a new verification email.
              </p>
              
              <Button onClick={handleResendVerification} className="w-full">
                Resend Verification Email
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// =============================================
// AUTHENTICATION LAYOUT
// =============================================

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">UniMatch</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your gateway to university success
            </p>
          </div>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

// =============================================
// AUTHENTICATION GUARD
// =============================================

export const AuthGuard = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate(redirectTo)
      } else if (!requireAuth && user) {
        navigate('/dashboard')
      }
    }
  }, [user, loading, navigate, requireAuth, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect via useEffect
  }

  if (!requireAuth && user) {
    return null // Will redirect via useEffect
  }

  return children
}

export default {
  LoginPage,
  SignupPage,
  ProfilePage,
  PasswordResetPage,
  EmailVerificationPage,
  AuthLayout,
  AuthGuard
}
