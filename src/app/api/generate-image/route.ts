import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import ZAI from 'z-ai-web-dev-sdk'

const SUPPORTED_SIZES = [
  '1024x1024',
  '768x1344', 
  '864x1152',
  '1344x768',
  '1152x864',
  '1440x720',
  '720x1440'
]

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!SUPPORTED_SIZES.includes(size)) {
      return NextResponse.json(
        { error: `Unsupported size: ${size}. Use one of: ${SUPPORTED_SIZES.join(', ')}` },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const response = await zai.images.generations.create({
      prompt: prompt,
      size: size
    })

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from image generation API')
    }

    const imageBase64 = response.data[0].base64
    const buffer = Buffer.from(imageBase64, 'base64')
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const filename = `image_${Date.now()}.png`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, buffer)

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      prompt: prompt,
      size: size,
      fileSize: buffer.length
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image: ' + error.message },
      { status: 500 }
    )
  }
}