/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('fi') fi: any;
  @Output() imagePick2 = new EventEmitter<string | File>();

  selectedImage: string;
  usePicker = false;
  @ViewChild('filePicker') file: any;

  constructor( private storage: AngularFireStorage,
    private fire: AngularFirestore,private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
    /*if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }*/
  }

  onPickImage() {
    console.log('on onPickImage ');

    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    })
      .then(image => {

        this.selectedImage = image.dataUrl;
        //console.log('data url: '+this.fi.nativeElement.files[0]);
      // this.storage.upload(`${Date.now}_${image.path}`,image.);
        this.imagePick.emit(image.dataUrl);
     //   this.imagePick2.emit(this.fi.nativeElement.files[0]);

      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    console.log('on file chosen');
    console.log('image data'+ (event.target as HTMLInputElement).files[0].name);
  //  this.storage.upload(`${Date.now}_${(event.target as HTMLInputElement).files[0].name}`,(event.target as HTMLInputElement).files[0]);
   /* const files=(event.target as HTMLInputElement).files[0];
    console.log('on file chosen'+files);
    const filePath=`${Date.now}_${files.name}`;
    this.storage.upload(filePath,files);
    this.fire.collection('i').add({image: filePath});*/
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      console.log('data url'+dataUrl);
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

}
