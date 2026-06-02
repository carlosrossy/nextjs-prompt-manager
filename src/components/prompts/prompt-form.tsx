'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createPromptAction } from '@/app/actions/prompt.actions';

import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const PromptForm = () => {
  const router = useRouter();
  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const submit = async (data: CreatePromptDTO) => {
    const result = await createPromptAction(data);

    if (!result.success) {
      if (result.errors?.title?.[0]) {
        form.setError('title', { message: result.errors.title[0] });
      }
      if (result.errors?.content?.[0]) {
        form.setError('content', { message: result.errors.content[0] });
      }
      toast.error(result.message ?? 'Falha ao criar o prompt');
      return;
    }

    toast.success(result.message ?? 'Prompt criado com sucesso!');
    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
          <Button type="submit" size="sm">
            Salvar
          </Button>
        </header>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Título do prompt"
                  variant="transparent"
                  size="lg"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Digite o conteúdo do prompt..."
                  variant="transparent"
                  size="lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
