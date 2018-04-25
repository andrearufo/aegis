<template>
    <div id="app">

        <div class="container">

            <div class="row">
                <div class="col">

                    <div class="row">
                        <div class="col">

                            <div class="card">
                                Cittadini / Popolazione<br>
                                {{ a.cittadini}} / {{ popolazione }}
                            </div>

                        </div>
                        <div class="col">

                            <div class="card">
                                Cittadini disoccupati<br>
                                {{ freeCittadini }} / {{ a.cittadini}}
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col">

                    <table>
                        <tr>
                            <td width="200"><button type="button" @click="a.risorse.cibo++" :disabled="this.a.risorse.cibo >= this.capacitaCibo">Raccogli cibo</button></td>
                            <td width="120">{{ a.risorse.cibo | r }} / {{ capacitaCibo }}</td>
                            <td>{{ produzioneCibo | r }} cibo/sec</td>
                        </tr>

                        <tr>
                            <td width="200"><button type="button" @click="a.risorse.legno++" :disabled="this.a.risorse.legno >= this.capacitaLegno">Raccogli legno</button></td>
                            <td width="120">{{ a.risorse.legno | r }} / {{ capacitaLegno }}</td>
                            <td>{{ produzioneLegno | r }} legno/sec</td>
                        </tr>

                        <tr>
                            <td width="200"><button type="button" @click="a.risorse.pietra++" :disabled="this.a.risorse.pietra >= this.capacitaPietra">Raccogli pietra</button></td>
                            <td width="120">{{ a.risorse.pietra | r }} / {{ capacitaPietra }}</td>
                            <td>{{ produzionePietra | r }} pietra/sec</td>
                        </tr>
                    </table>

                </div>
            </div>

            <table>
                <tr>
                    <td><button type="button" @click="creaCittadino(1)" :disabled="!autorizzaCittadino(1)">Crea Cittadino</button></td>
                    <td width="40"><button type="button" @click="creaCittadino(10)" :disabled="!autorizzaCittadino(10)">+10</button></td>
                    <td>{{ a.cittadini }}</td>
                    <td>Servono 10 unità di cibo</td>
                    <td>+ 1 cittadino</td>

                    <td>{{ a.cittadini}} cittadini</td>
                    <td></td>
                    <td width="40"></td>
                    <td width="40"></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaCasa()" :disabled="!autorizzaCasa()">Crea Casa</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.case }}</td>
                    <td>Servono 10 unità di legname</td>
                    <td>+10 popolazione</td>

                    <td>{{ popolazione }} popolazione tot.</td>
                    <td></td>
                    <td width="40"></td>
                    <td width="40"></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaFattoria()" :disabled="!autorizzaFattoria()">Crea Fattoria</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.fattorie }}</td>
                    <td>Servono 10 unità di cibo e 10 di legname</td>
                    <td>+ {{ fattori.costruzioni.falegnamerie }} contadini</td>

                    <td>{{ a.lavoratori.contadini }} / {{ maxContadini }} contadini</td>
                    <td>(+ {{ fattori.lavoratori.contadini }} cibo/sec)</td>
                    <td width="40"><button :disabled="!canRemContadino()" @click="remContadino()">-</button></td>
                    <td width="40"><button :disabled="!canAddContadino()" @click="addContadino()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaFalegnameria()" :disabled="!autorizzaFalegnameria()">Crea Falegnameria</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.falegnamerie }}</td>
                    <td>Servono 10 unità di legname e 10 di pietra</td>
                    <td>+ {{ fattori.costruzioni.falegnamerie }} taglialegna</td>

                    <td>{{ a.lavoratori.taglialegna }} / {{ maxTaglialegna }} taglialegna</td>
                    <td>(+ {{ fattori.lavoratori.taglialegna }} legno/sec)</td>
                    <td width="40"><button :disabled="!canRemTaglialegna()" @click="remTaglialegna()">-</button></td>
                    <td width="40"><button :disabled="!canAddTaglialegna()" @click="addTaglialegna()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaMiniera()" :disabled="!autorizzaMiniera()">Crea Miniera</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.miniere }}</td>
                    <td>Servono 20 unità di legname e 10 di pietra</td>
                    <td>+ {{ fattori.costruzioni.miniere }} minatori</td>

                    <td>{{ a.lavoratori.minatori }} / {{ maxMinatori }} minatori</td>
                    <td>(+ {{ fattori.lavoratori.minatori }} pietra/sec)</td>
                    <td width="40"><button :disabled="!canRemMinatore()" @click="remMinatore()">-</button></td>
                    <td width="40"><button :disabled="!canAddMinatore()" @click="addMinatore()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaGranaio()" :disabled="!autorizzaGranaio()">Crea Granaio</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.granai }}</td>
                    <td>Servono 100 unità di legname e 100 di pietra</td>
                    <td>+ {{ fattori.costruzioni.granai }} capacità cibo</td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaRimessa()" :disabled="!autorizzaRimessa()">Crea Rimessa</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.rimesse }}</td>
                    <td>Servono 100 unità di legname e 100 di pietra</td>
                    <td>+ {{ fattori.costruzioni.rimesse }} capacità legna</td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaMagazzino()" :disabled="!autorizzaMagazzino()">Crea Magazzino</button></td>
                    <td width="40"></td>
                    <td>{{ a.costruzioni.magazzini }}</td>
                    <td>Servono 100 unità di legname e 100 di pietra</td>
                    <td>+ {{ fattori.costruzioni.magazzini }} capacità pietra</td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>

            <br>

            <button type="button" @click="salva()">Salva</button>

            <hr>

            <div class="row">
                <div class="col">

                    Risorse:
                    <pre>{{ a }}</pre>

                </div>
                <div class="col">

                    Fattori
                    <pre>{{ fattori }}</pre>

                </div>
                <div class="col">

                    Logger
                    <pre>{{ logger.slice().reverse() }}</pre>

                </div>
            </div>

        </div> <!-- /container -->

    </div>
</template>

<script>

export default {
    name: 'app',

    data(){
        return {
            a: {
                risorse: {
                    cibo: 0,
                    legno: 0,
                    pietra: 0
                },
                cittadini: 0,
                lavoratori: {
                    contadini: 0,
                    taglialegna: 0,
                    minatori: 0
                },
                costruzioni: {
                    case: 0,
                    fattorie: 0,
                    falegnamerie: 0,
                    miniere: 0,
                    granai: 0,
                    rimesse: 0,
                    magazzini: 0
                }
            },
            logger: [],
            fattori: {
                base: {
                    cittadini: 0,
                    cibo: 100,
                    legno: 100,
                    pietra: 100,
                },
                lavoratori: {
                    contadini: 1,
                    taglialegna: 1,
                    minatori: 1
                },
                costruzioni: {
                    case: 10,
                    fattorie: 10,
                    falegnamerie: 10,
                    miniere: 10,
                    granai: 100,
                    rimesse: 100,
                    magazzini: 100
                }
            }
        }
    },

    computed:{
        popolazione(){
            return (this.a.costruzioni.case * this.fattori.costruzioni.case) + this.fattori.base.cittadini;
        },
        produzioneCibo(){
            return this.a.lavoratori.contadini * this.fattori.lavoratori.contadini;
        },
        produzioneLegno(){
            return this.a.lavoratori.taglialegna * this.fattori.lavoratori.taglialegna;
        },
        produzionePietra(){
            return this.a.lavoratori.minatori * this.fattori.lavoratori.minatori;
        },

        capacitaCibo(){
            return (this.a.costruzioni.granai * this.fattori.costruzioni.granai) + this.fattori.base.cibo;
        },
        capacitaLegno(){
            return (this.a.costruzioni.rimesse * this.fattori.costruzioni.rimesse) + this.fattori.base.legno;
        },
        capacitaPietra(){
            return (this.a.costruzioni.magazzini * this.fattori.costruzioni.magazzini) + this.fattori.base.pietra;
        },

        freeCittadini(){
            return this.a.cittadini - this.a.lavoratori.contadini - this.a.lavoratori.taglialegna - this.a.lavoratori.minatori;
        },

        maxContadini(){
            return this.a.costruzioni.fattorie * this.fattori.costruzioni.fattorie;
        },
        maxTaglialegna(){
            return this.a.costruzioni.falegnamerie * this.fattori.costruzioni.falegnamerie;
        },
        maxMinatori(){
            return this.a.costruzioni.miniere * this.fattori.costruzioni.miniere;
        }
    },

    methods: {
        autorizzaCittadino(n){
            return this.a.risorse.cibo >= (10 * n) && this.popolazione > this.a.cittadini && this.popolazione >= (this.a.cittadini + n);
        },
        creaCittadino(n){
            if( this.autorizzaCittadino(n) ){
                this.a.cittadini = this.a.cittadini + n;
                this.a.risorse.cibo = this.a.risorse.cibo - (10 * n);
                this.nuovoLogger('Creati '+n+' cittadini');
            }
        },

        canAddContadino(){
            return this.freeCittadini > 0 && this.maxContadini > this.a.lavoratori.contadini;
        },
        addContadino(){
            if( this.canAddContadino() ){
                this.a.lavoratori.contadini++;
            }
        },
        canRemContadino(){
            return this.a.lavoratori.contadini > 0;
        },
        remContadino(){
            if( this.canRemContadino() ){
                this.a.lavoratori.contadini--;
            }
        },

        canAddTaglialegna(){
            return this.freeCittadini > 0 && this.maxTaglialegna > this.a.lavoratori.taglialegna
        },
        addTaglialegna(){
            if( this.canAddTaglialegna() ){
                this.a.lavoratori.taglialegna++;
            }
        },
        canRemTaglialegna(){
            return this.a.lavoratori.taglialegna > 0;
        },
        remTaglialegna(){
            if( this.canRemTaglialegna() ){
                this.a.lavoratori.taglialegna--;
            }
        },

        canAddMinatore(){
            return this.freeCittadini > 0 && this.maxMinatori > this.a.lavoratori.minatori
        },
        addMinatore(){
            if( this.freeCittadini > 0 ){
                this.a.lavoratori.minatori++;
            }
        },
        canRemMinatore(){
            return this.a.lavoratori.minatori > 0;
        },
        remMinatore(){
            if( this.a.lavoratori.minatori > 0 ){
                this.a.lavoratori.minatori--;
            }
        },

        autorizzaCasa(){
            return this.a.risorse.legno >= 10;
        },
        creaCasa(){
            if( this.autorizzaCasa() ){
                this.a.costruzioni.case++;
                this.a.risorse.legno = this.a.risorse.legno - 10;
                this.nuovoLogger('Creata casa');
            }
        },
        autorizzaFattoria(){
            return this.a.risorse.cibo >= 10 && this.a.risorse.legno >= 10;
        },
        creaFattoria(){
            if( this.autorizzaFattoria() ){
                this.a.costruzioni.fattorie++;
                this.a.risorse.cibo = this.a.risorse.cibo - 10;
                this.a.risorse.legno = this.a.risorse.legno - 10;
                this.nuovoLogger('Creata fattoria');
            }
        },
        autorizzaFalegnameria(){
            return this.a.risorse.legno >= 10 && this.a.risorse.pietra >= 10;
        },
        creaFalegnameria(){
            if( this.autorizzaFalegnameria() ){
                this.a.costruzioni.falegnamerie++;
                this.a.risorse.legno = this.a.risorse.legno - 10;
                this.a.risorse.pietra = this.a.risorse.pietra - 10;
                this.nuovoLogger('Creata falegnameria');
            }
        },
        autorizzaMiniera(){
            return this.a.risorse.legno >= 20 && this.a.risorse.pietra >= 10;
        },
        creaMiniera(){
            if( this.autorizzaMiniera() ){
                this.a.costruzioni.miniere++;
                this.a.risorse.legno = this.a.risorse.legno - 20;
                this.a.risorse.pietra = this.a.risorse.pietra - 10;
                this.nuovoLogger('Creata miniera');
            }
        },
        autorizzaGranaio(){
            return this.a.risorse.legno >= 100 && this.a.risorse.pietra >= 100;
        },
        creaGranaio(){
            if( this.autorizzaGranaio() ){
                this.a.costruzioni.granai++;
                this.a.risorse.legno = this.a.risorse.legno - 100;
                this.a.risorse.pietra = this.a.risorse.pietra - 100;
                this.nuovoLogger('Creato granio');
            }
        },
        autorizzaRimessa(){
            return this.a.risorse.legno >= 100 && this.a.risorse.pietra >= 100;
        },
        creaRimessa(){
            if( this.autorizzaRimessa() ){
                this.a.costruzioni.rimesse++;
                this.a.risorse.legno = this.a.risorse.legno - 100;
                this.a.risorse.pietra = this.a.risorse.pietra - 100;
                this.nuovoLogger('Creata rimessa');
            }
        },
        autorizzaMagazzino(){
            return this.a.risorse.legno >= 100 && this.a.risorse.pietra >= 100;
        },
        creaMagazzino(){
            if( this.autorizzaMagazzino() ){
                this.a.costruzioni.magazzini++;
                this.a.risorse.legno = this.a.risorse.legno - 100;
                this.a.risorse.pietra = this.a.risorse.pietra - 100;
                this.nuovoLogger('Creato magazzino');
            }
        },

        salva(){
            localStorage.setItem('aegis', JSON.stringify(this.a));
            this.nuovoLogger('Autosave');
            var t = this;
            setTimeout(function(){ t.salva() }, 30000);
        },
        reset(){
            if( confirm('Sei sicuro? Tutti i progressi andranno persi...') ){
                localStorage.removeItem('aegis');
                location.reload();
            }
        },
        checkSalvataggio(){
            if (localStorage.length > 0) {
                var aegis = JSON.parse(localStorage.getItem('aegis'));

                if(typeof aegis !== null)
                    this.a = aegis;

                this.nuovoLogger('Loading');
            }
            this.salva();
        },
        checkProduzione(){
            // this.nuovoLogger('Produzione avviata');

            if( this.capacitaCibo > this.a.risorse.cibo ){
                if( this.a.risorse.cibo + this.produzioneCibo > this.capacitaCibo){
                    this.a.risorse.cibo = this.capacitaCibo;
                }else{
                    this.a.risorse.cibo = this.a.risorse.cibo + this.produzioneCibo;
                }
            }

            if( this.capacitaLegno > this.a.risorse.legno ){
                if( this.a.risorse.legno + this.produzioneLegno > this.capacitaLegno){
                    this.a.risorse.legno = this.capacitaLegno;
                }else{
                    this.a.risorse.legno = this.a.risorse.legno + this.produzioneLegno;
                }
            }

            if( this.capacitaPietra > this.a.risorse.pietra ){
                if( this.a.risorse.pietra + this.produzionePietra > this.capacitaPietra){
                    this.a.risorse.pietra = this.capacitaPietra;
                }else{
                    this.a.risorse.pietra = this.a.risorse.pietra + this.produzionePietra;
                }
            }

            var t = this;
            setTimeout(function(){ t.checkProduzione() }, 1000);
        },
        nuovoLogger (message) {
            var d = (new Date()).toISOString();
            this.logger.push(d+' - '+message);
        }
    },

    filters: {
        r(num){
            return Math.round(num * 100) / 100;
        }
    },

    created(){
        this.checkSalvataggio();
        this.nuovoLogger('Start');
        this.checkProduzione();
    }
}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i|Roboto+Mono');

$font-sans: 'Roboto Condensed', sans-serif;
$font-mono: 'Roboto Mono', monospace;

$text: #2c3e50;
$main: #42b983;
$border: 1px solid #ddd;

.container{
    margin: 60px auto;
    max-width: 1200px;
    color: $text;
    line-height: 2;
    font-size: 16px;
    font-family: $font-sans;

    .row{
        display: flex;
        margin-right: -15px;
        margin-left: -15px;

        .col{
            flex-basis: 0;
            flex-grow: 1;
            max-width: 100%;
            padding: 15px;
        }
    }
}

.card{
    border: $border;
    border-radius: 5px;
    padding: 10px;
}

button{
    background: $main;
    color: white;
    border: 0;
    font-size: 16px;
    line-height: 2;
    display: block;
    width: 100%;

    &:disabled{
        background: lighten($main, 20%);
    }
}

table{
    width: 100%;

    tr{
        > td{
            border-bottom: $border;
            padding: 5px;
        }
    }
}

pre{
    padding: 10px;
    background: #eee;
    font-family: $font-mono;
    font-size: 12px;
}

hr{
    width: 100%;
    display: block;
    border: 0;
    border-bottom: $border;
    margin: 20px 0;
}

a {
    color: $main;
}

</style>
