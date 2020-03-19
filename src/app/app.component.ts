import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'nglar-electron';

  constructor(private readonly electronService: ElectronService) { }

  ngOnInit(): void {
    if (this.electronService.isElectronApp) {
      console.log('test')
    } else {
      console.log('electron is not working')
    }
  }
}
