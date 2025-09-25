import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

const albumFormSchema = z.object({
  albumName: z.string()
    .min(1, "Album name is required")
    .max(50, "Album name must be 50 characters or less")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Album name can only contain letters, numbers, spaces, hyphens, and underscores"),
  year: z.number().min(2017).max(2025),
  month: z.number().min(0).max(11),
});

type AlbumFormValues = z.infer<typeof albumFormSchema>;

interface AlbumFormProps {
  onSubmit: (albumName: string, year: number, month: number) => void;
  defaultAlbumName?: string;
  lockAlbumName?: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 9 }, (_, i) => 2017 + i); // 2017-2025

export default function AlbumForm({ onSubmit, defaultAlbumName = "", lockAlbumName = false }: AlbumFormProps) {
  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: {
      albumName: defaultAlbumName,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  });

  const handleSubmit = (values: AlbumFormValues) => {
    onSubmit(values.albumName, values.year, values.month);
  };

  return (
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Browse Your Photo Albums</h1>
        <p className="text-lg text-muted-foreground">
          Enter your album details to view your memories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Album Selection</CardTitle>
          <CardDescription>
            Choose the album name, year, and month to view your photos and videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="albumName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter album name (e.g., Vacation, Family Trip)"
                        data-testid="input-album-name"
                        disabled={lockAlbumName}
                        readOnly={lockAlbumName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        data-testid="select-year"
                      >
                        <FormControl>
                          <SelectTrigger data-testid="trigger-year">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()} data-testid={`year-option-${year}`}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        data-testid="select-month"
                      >
                        <FormControl>
                          <SelectTrigger data-testid="trigger-month">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()} data-testid={`month-option-${index}`}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
                data-testid="button-submit-album"
              >
                View Album
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}