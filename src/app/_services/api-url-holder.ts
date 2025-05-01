import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlHolder {
  url?: URL;

  public getApiUrl(): string {
    if (this.url) {
      return this.url.toString();
    }
    let apiHostname = environment.apiHostname == "" ? window.location.hostname : environment.apiHostname;
    console.warn("hostmane: '" + apiHostname + "'")
    this.url = new URL("http://" + apiHostname + ":" + environment.apiPort);
    return this.url.toString()
  }
}
