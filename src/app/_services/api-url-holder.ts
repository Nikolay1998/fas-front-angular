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
    let apiHostname = environment.apiHostname == "" ? "http://" + window.location.hostname : environment.apiHostname;
    this.url = new URL(apiHostname + ":" + environment.apiPort);
    return this.url.toString();
  }
}
