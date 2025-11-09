import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2gb',
    },
  },
};

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم تحديد ملف' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_large_stream(
        {
          folder: 'luna-caftan',
          resource_type: 'auto',
          chunk_size: 10_000_000,
          overwrite: false,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Return the Cloudinary URL
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: result.original_filename,
      size: file.size,
      type: file.type,
    });

  } catch (error: any) {
    console.error('Upload error:', error);

    const cloudinaryMessage: string | undefined = error?.message || error?.error?.message;
    const httpStatus: number = error?.http_code || 500;

    let clientMessage = 'فشل رفع الصورة';

    if (cloudinaryMessage) {
      if (cloudinaryMessage.includes('File size too large')) {
        clientMessage = 'حجم الصورة يتجاوز الحد المسموح به على الخادم. يرجى تقليل الحجم أو الأبعاد.';
      } else if (cloudinaryMessage.toLowerCase().includes('invalid image')) {
        clientMessage = 'نوع الصورة غير صالح أو تالف. يرجى اختيار صورة صحيحة.';
      } else if (cloudinaryMessage.toLowerCase().includes('timeout')) {
        clientMessage = 'انتهت مهلة الاتصال أثناء الرفع. يرجى المحاولة مرة أخرى.';
      }
    }

    return NextResponse.json(
      { error: clientMessage, details: cloudinaryMessage },
      { status: httpStatus }
    );
  }
}

// Get list of uploaded images from Cloudinary
export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'luna-caftan/products',
      max_results: 500,
    });

    const images = result.resources.map((resource: any) => ({
      filename: resource.public_id,
      url: resource.secure_url,
      size: resource.bytes,
      createdAt: resource.created_at,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [] });
  }
}

// Delete uploaded image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'معرف الصورة مطلوب' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة بنجاح',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'فشل حذف الصورة' },
      { status: 500 }
    );
  }
}
