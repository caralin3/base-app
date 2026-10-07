import {
  Button,
  ControlledInput,
  Image,
  type ImgProps,
  Text,
  View,
} from '@base-app/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

const schema = z
  .object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type FormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  /** Shown as the form heading */
  appName: string;
  authError?: string | null;
  /** Optional logo above the heading, e.g. require('@/assets/images/logo.png') */
  logo?: ImgProps['source'];
  /** Size of the logo; defaults to 200x100 */
  logoStyle?: ImgProps['style'];
  onSubmit?: SubmitHandler<FormType>;
};

export const RegisterForm = ({
  appName,
  onSubmit = () => {},
  authError = null,
  logo,
  logoStyle = { width: 200, height: 100 },
}: RegisterFormProps) => {
  const router = useRouter();

  const { handleSubmit, control, formState } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center gap-4 bg-background p-8 dark:bg-background-dark">
        <View className="items-center justify-center">
          {!!logo ? (
            <Image source={logo} contentFit="contain" style={logoStyle} />
          ) : (
            <Text className="pb-8 text-center text-5xl/tight font-bold">
              {appName}
            </Text>
          )}
        </View>
        <Text
          testID="form-title"
          className="pb-6 text-center text-4xl font-bold"
        >
          Register
        </Text>
        <ControlledInput
          containerStyles="mb-4"
          testID="email-input"
          control={control}
          name="email"
          label="Email"
          required
          error={formState.errors.email?.message}
          keyboardType="email-address"
        />
        <ControlledInput
          containerStyles="mb-4"
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          secureTextEntry={true}
          required
          error={formState.errors.password?.message}
        />
        <ControlledInput
          containerStyles="mb-4"
          testID="confirm-password-input"
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          secureTextEntry={true}
          required
          error={formState.errors.confirmPassword?.message}
        />
        {authError ? (
          <Text testID="auth-error" className="mb-2 text-center text-red-400">
            {authError}
          </Text>
        ) : null}
        <Button
          testID="register-button"
          label="Register"
          onPress={handleSubmit(onSubmit)}
          size="lg"
        />
        <View className="items-center justify-center">
          <Text className="flex flex-row items-start text-center">
            Already have an account?
          </Text>
          <Button
            label="Login"
            variant="ghost"
            onPress={() => router.navigate('/login')}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
