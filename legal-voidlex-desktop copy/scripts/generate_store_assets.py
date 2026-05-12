import os
from PIL import Image, ImageDraw, ImageFont

def make_gradient_background(width, height, color1, color2):
    # Create a vertical linear gradient from color1 to color2
    base = Image.new("RGBA", (width, height), color1)
    top = Image.new("RGBA", (width, height), color2)
    mask = Image.new("L", (width, height))
    for y in range(height):
        # Calculate gradient factor
        factor = int(255 * (y / height))
        for x in range(width):
            mask.putpixel((x, y), factor)
    return Image.composite(top, base, mask)

def generate_assets():
    logo_path = r'd:\OneDrive_2026-05-09\void lex\legal-voidlex-desktop\src\renderer\logo.png'
    output_dir = r'd:\OneDrive_2026-05-09\void lex\legal-voidlex-desktop\store_assets'
    os.makedirs(output_dir, exist_ok=True)
    
    # Load original logo
    logo = Image.open(logo_path)
    print(f"Loaded logo of size {logo.size}")
    
    # Define our premium brand background colors (Very dark, rich navy/black gradient)
    dark_bg_1 = (10, 10, 16, 255) # Deepest obsidian blue
    dark_bg_2 = (22, 22, 34, 255) # Modern slate charcoal
    
    # Define targets
    # Format: (name, width, height, type)
    targets = [
        ("poster_art_720x1080.png", 720, 1080, "poster"),
        ("box_art_1080x1080.png", 1080, 1080, "square"),
        ("app_tile_300x300.png", 300, 300, "square"),
        ("logo_150x150.png", 150, 150, "square"),
        ("logo_71x71.png", 71, 71, "square")
    ]
    
    for filename, width, height, asset_type in targets:
        print(f"Generating {filename} ({width}x{height})...")
        # Create base gradient background
        canvas = make_gradient_background(width, height, dark_bg_1, dark_bg_2)
        
        if asset_type == "square":
            # For 1:1, center the logo preserving aspect ratio
            # Use 75% of width as safe area
            target_w = int(width * 0.8)
            ratio = logo.size[0] / logo.size[1]
            target_h = int(target_w / ratio)
            
            # If target_h exceeds 80% of canvas height, downscale further
            if target_h > int(height * 0.8):
                target_h = int(height * 0.8)
                target_w = int(target_h * ratio)
                
            resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            # Center it
            offset_x = (width - target_w) // 2
            offset_y = (height - target_h) // 2
            canvas.alpha_composite(resized_logo, (offset_x, offset_y))
            
        elif asset_type == "poster":
            # For poster art, center the logo in the upper portion
            target_w = int(width * 0.95)
            ratio = logo.size[0] / logo.size[1]
            target_h = int(target_w / ratio)
            
            resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            # Composite logo on top
            offset_x = (width - target_w) // 2
            offset_y = 120 # Leave space at the top
            canvas.alpha_composite(resized_logo, (offset_x, offset_y))
            
            # Draw beautiful typography below logo
            draw = ImageDraw.Draw(canvas)
            
            # Draw luxury-brand thin golden guideline separator
            line_y = offset_y + target_h + 100
            draw.line([(60, line_y), (width - 60, line_y)], fill=(212, 175, 55, 120), width=1)
            
            font_title = None
            font_sub = None
            try:
                # Try loading Georgia, Times New Roman, or Arial from standard Windows Fonts
                font_title = ImageFont.truetype("georgia.ttf", 60)
                font_sub = ImageFont.truetype("arial.ttf", 22)
            except IOError:
                try:
                    font_title = ImageFont.truetype("times.ttf", 60)
                    font_sub = ImageFont.truetype("times.ttf", 22)
                except IOError:
                    # Fallback to default
                    font_title = ImageFont.load_default()
                    font_sub = ImageFont.load_default()
            
            # Title text: VOIDLEX
            text_title = "VOIDLEX"
            if font_title:
                bbox = draw.textbbox((0, 0), text_title, font=font_title)
                w = bbox[2] - bbox[0]
                tx = (width - w) // 2
                ty = line_y + 40
                draw.text((tx, ty), text_title, font=font_title, fill=(212, 175, 55, 255)) # Rich Gold
                
            # Subtitle text: LOCAL AI LEGAL INTELLIGENCE
            text_sub = "LOCAL AI LEGAL INTELLIGENCE"
            if font_sub:
                bbox = draw.textbbox((0, 0), text_sub, font=font_sub)
                w = bbox[2] - bbox[0]
                sx = (width - w) // 2
                sy = ty + 90
                draw.text((sx, sy), text_sub, font=font_sub, fill=(255, 255, 255, 180)) # Sleek Off-White
                
                # Bottom small text: IMPERIAL EMINENCE
                text_brand = "IMPERIAL EMINENCE CYBERGUARD CORPORATION"
                bbox_brand = draw.textbbox((0, 0), text_brand, font=font_sub)
                bw = bbox_brand[2] - bbox_brand[0]
                bx = (width - bw) // 2
                by = height - 120
                draw.text((bx, by), text_brand, font=font_sub, fill=(150, 150, 160, 255)) # Elegant Grey
                
        # Save output image
        save_path = os.path.join(output_dir, filename)
        canvas.convert("RGB").save(save_path, "PNG", quality=95)
        print(f"Saved {filename} to {save_path}")

if __name__ == "__main__":
    generate_assets()
