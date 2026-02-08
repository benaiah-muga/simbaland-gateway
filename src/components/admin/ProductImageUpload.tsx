import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Link as LinkIcon, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductImageUploadProps {
  currentImageUrl: string | null;
  onImageChange: (url: string | null) => void;
}

export const ProductImageUpload = ({ currentImageUrl, onImageChange }: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a canvas to convert to WebP
      const img = document.createElement('img');
      const reader = new FileReader();

      reader.onload = () => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          // Resize to max 800px while maintaining aspect ratio
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                setUploading(false);
                return;
              }

              const fileName = `${Date.now()}-${file.name.replace(/\.[^.]+$/, '')}.webp`;
              const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, blob, { contentType: 'image/webp' });

              if (error) {
                console.error('Upload error:', error);
                setUploading(false);
                return;
              }

              const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(data.path);

              const publicUrl = urlData.publicUrl;
              setPreview(publicUrl);
              onImageChange(publicUrl);
              setUploading(false);
            },
            'image/webp',
            0.85
          );
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setPreview(imageUrl.trim());
      onImageChange(imageUrl.trim());
    }
  };

  const clearImage = () => {
    setPreview(null);
    setImageUrl('');
    onImageChange(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Product Image</Label>

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Product preview"
            className="h-32 w-32 object-cover rounded-xl border border-border bg-secondary"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="upload" className="text-xs gap-1">
            <Upload className="h-3 w-3" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs gap-1">
            <LinkIcon className="h-3 w-3" /> URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-2">
          <div className="relative">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="product-image-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-20 border-dashed border-2 flex flex-col gap-1"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Converting to WebP...</span>
                </>
              ) : (
                <>
                  <Image className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload (auto-optimized to WebP)</span>
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-2">
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleUrlSubmit}>
              Set
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
