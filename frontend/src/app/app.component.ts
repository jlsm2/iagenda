import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { CampoAtividadesFlexiveisComponent } from "./features/campo-atividades-flexiveis/campo-atividades-flexiveis.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CampoAtividadesFlexiveisComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'iagenda';
}
