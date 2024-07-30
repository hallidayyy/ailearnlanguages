// app/studyroom/page.tsx
import MainLayout from "@/components/MainLayout";
import AudioUploader from "@/components/StudyRoom/AudioUploader";
import TabsComponent from "@/components/StudyRoom/TabsComponent";


export default function StudyRoom() {
  return (
    <MainLayout>
      <div className="w-screen h-screen flex items-center justify-center">
       
        <AudioUploader />
        <TabsComponent />
      </div>
    </MainLayout>
  );
}