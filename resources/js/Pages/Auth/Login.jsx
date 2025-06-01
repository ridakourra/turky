import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { User, KeyRound, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cin: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('login'), {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-4">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{
                    backgroundImage: 'url(https://p1.zoon.ru/8/2/62a8da0cd76e083e4e014ff8_62a8db27833b32.08287086.jpg)',
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-xl relative z-10 bg-white/90 backdrop-blur-md shadow-2xl">
                <CardHeader className="space-y-4 pb-6">
                    <CardTitle className="text-3xl font-bold text-center text-[#262626]">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 text-lg">
                        Sign in to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.cin && (
                            <Alert variant="destructive" className="border-red-400">
                                <AlertCircle className="h-5 w-5" />
                                <AlertDescription className="text-sm ml-2">{errors.cin}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="CIN"
                                    value={data.cin}
                                    onChange={e => setData('cin', e.target.value)}
                                    className="pl-12 h-12 text-lg bg-gray-50/50 border-gray-200 focus:border-[#f9c401] focus:ring-[#f9c401]"
                                />
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="pl-12 h-12 text-lg bg-gray-50/50 border-gray-200 focus:border-[#f9c401] focus:ring-[#f9c401]"
                                />
                                <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing || loading}
                            className="w-full h-12 text-lg font-semibold bg-[#f9c401] hover:bg-[#e0b001] text-[#262626] shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {(processing || loading) ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
