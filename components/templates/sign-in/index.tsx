'use client'
import { cn } from '@/packages/utils/styles'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Trans } from '@lingui/react/macro'
import { useLingui } from '@lingui/react'
import { msg } from '@lingui/core/macro'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInDto, signInSchema } from '@/packages/models'
import { signIn } from '@/services/auth/sign-in.service'

export default function SignInTemplate({ className, ...props }: React.ComponentProps<'form'>) {
  const { i18n } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const form = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = async (data: SignInDto) => {
    try {
      await signIn(data)
    } catch {
      form.reset()
    }
  }

  return (
    <form
      id='form-sign-in'
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            <Trans>Login to your account</Trans>
          </h1>
          <h6 className='text-muted-foreground text-sm text-balance'>
            <Trans>Enter your email below to login to your account</Trans>
          </h6>
        </div>
        <Controller
          name='identifier'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='form-sign-in-identifier'>Email</FieldLabel>
              <Input
                {...field}
                id='form-sign-in-identifier'
                placeholder={i18n._(msg`m@example.com`)}
                aria-invalid={fieldState.invalid}
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='password'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className='flex items-center'>
                <FieldLabel htmlFor='form-sign-in-password'>
                  <Trans>Password</Trans>
                </FieldLabel>
                <a href='#' className='ml-auto text-sm underline-offset-4 hover:underline'>
                  <Trans>Forgot your password?</Trans>
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id='form-sign-in-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder={i18n._(msg`Enter password`)}
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align='inline-end'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant='ghost'
                        aria-label='Info'
                        size='icon-xs'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showPassword ? <Trans>Hide password</Trans> : <Trans>Show password</Trans>}</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type='submit' form='form-sign-in'>
            <Trans>Sign in</Trans>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
