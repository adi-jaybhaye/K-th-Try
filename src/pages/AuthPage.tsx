import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { BrandLogo } from '../components/brand/BrandLogo';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Database, Cloud, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isCloud = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCloud || !supabase) {
      navigate('/dashboard');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMessage('Account created! Check your email to confirm or sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <BrandLogo variant="lockup" size="lg" />
          </Link>
          <h2 className="font-display font-extrabold text-2xl text-[#1D1A39]">
            {mode === 'signup' ? 'Create Your Account' : 'Sign In to Workspace'}
          </h2>
          <p className="text-xs text-[#7E6C7C] mt-1">
            {isCloud
              ? 'Synchronize attempts across devices with Supabase'
              : 'Local Guest Mode active — accounts require Supabase configuration'}
          </p>
        </div>

        <Card className="p-6">
          {!isCloud ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Database className="w-4 h-4 text-amber-700" />
                  <span>Local Guest Mode Active</span>
                </div>
                <p className="mt-1.5 text-[11px] text-amber-800">
                  You are currently operating in full local IndexedDB mode. Your progress, attempts, and schedules are 100% saved in your browser without needing to sign up.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue in Guest Mode
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@example.com"
                  className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>

              <div className="text-center text-xs text-[#7E6C7C] pt-2">
                {mode === 'signup' ? (
                  <p>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[#451952] hover:underline">
                      Sign In
                    </Link>
                  </p>
                ) : (
                  <p>
                    New learner?{' '}
                    <Link to="/signup" className="font-semibold text-[#451952] hover:underline">
                      Create Account
                    </Link>
                  </p>
                )}
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
