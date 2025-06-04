from ultralytics import YOLO
import os

def load_model():
    """Load the YOLO model and verify it's working"""
    try:
        # You can use either the pretrained model or your custom model
        # model = YOLO("yolo11n-pose.pt")  # pretrained model
        model = YOLO("yolo11l.pt")  # your custom model
        print("✅ Model loaded successfully!")
        return model
    except Exception as e:
        print(f"❌ Failed to load YOLO model: {str(e)}")
        raise

def test_image(model, image_path):
    """Test the model with an image using direct Ultralytics inference
    
    Args:
        model: YOLO model instance
        image_path: Path to the image file
    """
    try:
        if not os.path.exists(image_path):
            print(f"❌ Image not found at {image_path}")
            return
            
        print(f"📸 Processing image: {image_path}")
        
        # Run inference with automatic saving and visualization
        results = model.predict(
            source=image_path,
            save=True,      # Save results
            show=True,      # Show results
            verbose=False,  # Suppress verbose output
            device=0        # Use GPU if available
        )
            
    except Exception as e:
        print(f"❌ Error processing image: {str(e)}")

def test_video(model, video_path):
    """Test the model with a video using direct Ultralytics inference
    
    Args:
        model: YOLO model instance
        video_path: Path to the video file
    """
    try:
        if not os.path.exists(video_path):
            print(f"❌ Video not found at {video_path}")
            return
            
        print(f"🎥 Processing video: {video_path}")
        print("Press 'q' to quit")
        
        # Run inference with automatic saving and visualization
        results = model.predict(
            source=video_path,
            save=True,      # Save results
            show=True,      # Show results
            stream=True,    # Stream results
            verbose=False,  # Suppress verbose output
            device=0        # Use GPU if available
        )
            
    except Exception as e:
        print(f"❌ Error processing video: {str(e)}")

def test_camera(model, camera_id=0):
    """Test the model with a live camera feed using Ultralytics direct inference
    
    Args:
        model: YOLO model instance
        camera_id: Camera device ID (default: 0 for primary camera)
    """
    try:
        print(f"📹 Starting camera test (Camera ID: {camera_id})")
        print("Press 'q' to quit")
        
        # Run inference with visualization
        results = model.predict(
            source=camera_id,
            show=True,      # Show results
            stream=True,    # Stream results
            verbose=False,  # Suppress verbose output
            device=0        # Use GPU if available
        )
        
                
    except Exception as e:
        print(f"❌ Error during camera test: {str(e)}")

def main():
    """Main function to run tests"""
    print("🤖 Starting YOLO model tests...")
    
    # Load the model
    model = load_model()
    
    # Menu for test selection
    while True:
        print("\n🔍 Select a test to run:")
        print("1. Test with image")
        print("2. Test with video")
        print("3. Test with camera")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            image_path = input("Enter the path to your image: ").strip()
            if image_path:
                print("\n📸 Testing with image...")
                test_image(model, image_path)
            else:
                print("❌ Please provide a valid image path")
        
        elif choice == "2":
            video_path = input("Enter the path to your video: ").strip()
            if video_path:
                print("\n🎥 Testing with video...")
                test_video(model, video_path)
            else:
                print("❌ Please provide a valid video path")
        
        elif choice == "3":
            camera_id = input("Enter camera ID (press Enter for default 0): ").strip()
            try:
                camera_id = int(camera_id) if camera_id else 0
                print("\n📹 Testing with camera...")
                test_camera(model, camera_id)
            except ValueError:
                print("❌ Invalid camera ID")
        
        elif choice == "4":
            print("👋 Exiting test program")
            break
        
        else:
            print("❌ Invalid choice. Please select 1-4")

if __name__ == "__main__":
    main() 