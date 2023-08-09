<template>
    <div id="app">

        <div class="container">

            <div class="row">
                <div class="col">

                    <div class="row">
                        <div class="col">

                            <div class="card">
                                Cittadini / Popolazione<br>
                                {{ civilta.cittadini}} / {{ popolazione }}
                            </div>

                        </div>
                        <div class="col">

                            <div class="card">
                                Cittadini disoccupati<br>
                                {{ freeCittadini }} / {{ civilta.cittadini}}
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col">

                    <table>
                        <tr>
                            <td width="200"><button type="button" @click="civilta.risorse.cibo++" :disabled="this.civilta.risorse.cibo >= this.capacitaCibo">Raccogli cibo</button></td>
                            <td width="120">{{ r(civilta.risorse.cibo) }} / {{ capacitaCibo }}</td>
                            <td>{{ r(produzioneCibo) }} cibo/sec - {{ r(alimentazione) }} cibo/sec</td>
                        </tr>

                        <tr>
                            <td width="200"><button type="button" @click="civilta.risorse.legno++" :disabled="this.civilta.risorse.legno >= this.capacitaLegno">Raccogli legno</button></td>
                            <td width="120">{{ r(civilta.risorse.legno) }} / {{ capacitaLegno }}</td>
                            <td>{{ r(produzioneLegno) }} legno/sec</td>
                        </tr>

                        <tr>
                            <td width="200"><button type="button" @click="civilta.risorse.pietra++" :disabled="this.civilta.risorse.pietra >= this.capacitaPietra">Raccogli pietra</button></td>
                            <td width="120">{{ r(civilta.risorse.pietra) }} / {{ capacitaPietra }}</td>
                            <td>{{ r(produzionePietra) }} pietra/sec</td>
                        </tr>
                    </table>

                </div>
            </div>

            <table>
                <tr>
                    <td><button type="button" @click="creaCittadino(1)" :disabled="!autorizzaCittadino(1)">Crea Cittadino</button></td>
                    <td width="40"><button type="button" @click="creaCittadino(10)" :disabled="!autorizzaCittadino(10)">+10</button></td>
                    <td>{{ civilta.cittadini }}</td>
                    <td>Servono 10 unità di cibo</td>
                    <td>+ 1 cittadino</td>

                    <td>{{ civilta.cittadini}} cittadini</td>
                    <td></td>
                    <td width="40"></td>
                    <td width="40"></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaCasa()" :disabled="!autorizzaCasa()">Crea Casa</button></td>
                    <td width="40"></td>
                    <td>{{ civilta.costruzioni.case }}</td>
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
                    <td>{{ civilta.costruzioni.fattorie }}</td>
                    <td>Servono 10 unità di cibo e 10 di legname</td>
                    <td>+ {{ fattori.costruzioni.falegnamerie }} contadini</td>

                    <td>{{ civilta.lavoratori.contadini }} / {{ maxContadini }} contadini</td>
                    <td>(+ {{ fattori.lavoratori.contadini }} cibo/sec)</td>
                    <td width="40"><button :disabled="!canRemContadino()" @click="remContadino()">-</button></td>
                    <td width="40"><button :disabled="!canAddContadino()" @click="addContadino()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaFalegnameria()" :disabled="!autorizzaFalegnameria()">Crea Falegnameria</button></td>
                    <td width="40"></td>
                    <td>{{ civilta.costruzioni.falegnamerie }}</td>
                    <td>Servono 10 unità di legname e 10 di pietra</td>
                    <td>+ {{ fattori.costruzioni.falegnamerie }} taglialegna</td>

                    <td>{{ civilta.lavoratori.taglialegna }} / {{ maxTaglialegna }} taglialegna</td>
                    <td>(+ {{ fattori.lavoratori.taglialegna }} legno/sec)</td>
                    <td width="40"><button :disabled="!canRemTaglialegna()" @click="remTaglialegna()">-</button></td>
                    <td width="40"><button :disabled="!canAddTaglialegna()" @click="addTaglialegna()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaMiniera()" :disabled="!autorizzaMiniera()">Crea Miniera</button></td>
                    <td width="40"></td>
                    <td>{{ civilta.costruzioni.miniere }}</td>
                    <td>Servono 20 unità di legname e 10 di pietra</td>
                    <td>+ {{ fattori.costruzioni.miniere }} minatori</td>

                    <td>{{ civilta.lavoratori.minatori }} / {{ maxMinatori }} minatori</td>
                    <td>(+ {{ fattori.lavoratori.minatori }} pietra/sec)</td>
                    <td width="40"><button :disabled="!canRemMinatore()" @click="remMinatore()">-</button></td>
                    <td width="40"><button :disabled="!canAddMinatore()" @click="addMinatore()">+</button></td>
                </tr>
                <tr>
                    <td><button type="button" @click="creaGranaio()" :disabled="!autorizzaGranaio()">Crea Granaio</button></td>
                    <td width="40"></td>
                    <td>{{ civilta.costruzioni.granai }}</td>
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
                    <td>{{ civilta.costruzioni.rimesse }}</td>
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
                    <td>{{ civilta.costruzioni.magazzini }}</td>
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
                    <pre>{{ civilta }}</pre>

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
    name: 'Legacy',

    data(){
        return {
            civilta: {
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
            return (this.civilta.costruzioni.case * this.fattori.costruzioni.case) + this.fattori.base.cittadini;
        },
        alimentazione(){
            return this.civilta.cittadini * 0.2;
        },
        produzioneCibo(){
            return (this.civilta.lavoratori.contadini * this.fattori.lavoratori.contadini) - this.alimentazione;
        },
        produzioneLegno(){
            return this.civilta.lavoratori.taglialegna * this.fattori.lavoratori.taglialegna;
        },
        produzionePietra(){
            return this.civilta.lavoratori.minatori * this.fattori.lavoratori.minatori;
        },

        capacitaCibo(){
            return (this.civilta.costruzioni.granai * this.fattori.costruzioni.granai) + this.fattori.base.cibo;
        },
        capacitaLegno(){
            return (this.civilta.costruzioni.rimesse * this.fattori.costruzioni.rimesse) + this.fattori.base.legno;
        },
        capacitaPietra(){
            return (this.civilta.costruzioni.magazzini * this.fattori.costruzioni.magazzini) + this.fattori.base.pietra;
        },

        freeCittadini(){
            return this.civilta.cittadini - this.civilta.lavoratori.contadini - this.civilta.lavoratori.taglialegna - this.civilta.lavoratori.minatori;
        },

        maxContadini(){
            return this.civilta.costruzioni.fattorie * this.fattori.costruzioni.fattorie;
        },
        maxTaglialegna(){
            return this.civilta.costruzioni.falegnamerie * this.fattori.costruzioni.falegnamerie;
        },
        maxMinatori(){
            return this.civilta.costruzioni.miniere * this.fattori.costruzioni.miniere;
        }
    },

    methods: {
        autorizzaCittadino(n){
            return this.civilta.risorse.cibo >= (10 * n) && this.popolazione > this.civilta.cittadini && this.popolazione >= (this.civilta.cittadini + n);
        },
        creaCittadino(n){
            if( this.autorizzaCittadino(n) ){
                this.civilta.cittadini = this.civilta.cittadini + n;
                this.civilta.risorse.cibo = this.civilta.risorse.cibo - (10 * n);
                this.nuovoLogger('Creati '+n+' cittadini');
            }
        },

        canAddContadino(){
            return this.freeCittadini > 0 && this.maxContadini > this.civilta.lavoratori.contadini;
        },
        addContadino(){
            if( this.canAddContadino() ){
                this.civilta.lavoratori.contadini++;
            }
        },
        canRemContadino(){
            return this.civilta.lavoratori.contadini > 0;
        },
        remContadino(){
            if( this.canRemContadino() ){
                this.civilta.lavoratori.contadini--;
            }
        },

        canAddTaglialegna(){
            return this.freeCittadini > 0 && this.maxTaglialegna > this.civilta.lavoratori.taglialegna
        },
        addTaglialegna(){
            if( this.canAddTaglialegna() ){
                this.civilta.lavoratori.taglialegna++;
            }
        },
        canRemTaglialegna(){
            return this.civilta.lavoratori.taglialegna > 0;
        },
        remTaglialegna(){
            if( this.canRemTaglialegna() ){
                this.civilta.lavoratori.taglialegna--;
            }
        },

        canAddMinatore(){
            return this.freeCittadini > 0 && this.maxMinatori > this.civilta.lavoratori.minatori
        },
        addMinatore(){
            if( this.freeCittadini > 0 ){
                this.civilta.lavoratori.minatori++;
            }
        },
        canRemMinatore(){
            return this.civilta.lavoratori.minatori > 0;
        },
        remMinatore(){
            if( this.civilta.lavoratori.minatori > 0 ){
                this.civilta.lavoratori.minatori--;
            }
        },

        autorizzaCasa(){
            return this.civilta.risorse.legno >= 10;
        },
        creaCasa(){
            if( this.autorizzaCasa() ){
                this.civilta.costruzioni.case++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 10;
                this.nuovoLogger('Creata casa');
            }
        },
        autorizzaFattoria(){
            return this.civilta.risorse.cibo >= 10 && this.civilta.risorse.legno >= 10;
        },
        creaFattoria(){
            if( this.autorizzaFattoria() ){
                this.civilta.costruzioni.fattorie++;
                this.civilta.risorse.cibo = this.civilta.risorse.cibo - 10;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 10;
                this.nuovoLogger('Creata fattoria');
            }
        },
        autorizzaFalegnameria(){
            return this.civilta.risorse.legno >= 10 && this.civilta.risorse.pietra >= 10;
        },
        creaFalegnameria(){
            if( this.autorizzaFalegnameria() ){
                this.civilta.costruzioni.falegnamerie++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 10;
                this.civilta.risorse.pietra = this.civilta.risorse.pietra - 10;
                this.nuovoLogger('Creata falegnameria');
            }
        },
        autorizzaMiniera(){
            return this.civilta.risorse.legno >= 20 && this.civilta.risorse.pietra >= 10;
        },
        creaMiniera(){
            if( this.autorizzaMiniera() ){
                this.civilta.costruzioni.miniere++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 20;
                this.civilta.risorse.pietra = this.civilta.risorse.pietra - 10;
                this.nuovoLogger('Creata miniera');
            }
        },
        autorizzaGranaio(){
            return this.civilta.risorse.legno >= 100 && this.civilta.risorse.pietra >= 100;
        },
        creaGranaio(){
            if( this.autorizzaGranaio() ){
                this.civilta.costruzioni.granai++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 100;
                this.civilta.risorse.pietra = this.civilta.risorse.pietra - 100;
                this.nuovoLogger('Creato granio');
            }
        },
        autorizzaRimessa(){
            return this.civilta.risorse.legno >= 100 && this.civilta.risorse.pietra >= 100;
        },
        creaRimessa(){
            if( this.autorizzaRimessa() ){
                this.civilta.costruzioni.rimesse++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 100;
                this.civilta.risorse.pietra = this.civilta.risorse.pietra - 100;
                this.nuovoLogger('Creata rimessa');
            }
        },
        autorizzaMagazzino(){
            return this.civilta.risorse.legno >= 100 && this.civilta.risorse.pietra >= 100;
        },
        creaMagazzino(){
            if( this.autorizzaMagazzino() ){
                this.civilta.costruzioni.magazzini++;
                this.civilta.risorse.legno = this.civilta.risorse.legno - 100;
                this.civilta.risorse.pietra = this.civilta.risorse.pietra - 100;
                this.nuovoLogger('Creato magazzino');
            }
        },

        salva(){
            localStorage.setItem('aegis', JSON.stringify(this.civilta));
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

                if(aegis != null){
                    this.civilta = aegis;
                }

                this.nuovoLogger('Loading');
            }
            this.salva();
        },
        checkProduzione(){
            // this.nuovoLogger('Produzione avviata');

            if( this.capacitaCibo > this.civilta.risorse.cibo ){
                if( this.civilta.risorse.cibo + this.produzioneCibo > this.capacitaCibo){
                    this.civilta.risorse.cibo = this.capacitaCibo;
                }else{
                    this.civilta.risorse.cibo = this.civilta.risorse.cibo + this.produzioneCibo;
                }
            }

            if( this.capacitaLegno > this.civilta.risorse.legno ){
                if( this.civilta.risorse.legno + this.produzioneLegno > this.capacitaLegno){
                    this.civilta.risorse.legno = this.capacitaLegno;
                }else{
                    this.civilta.risorse.legno = this.civilta.risorse.legno + this.produzioneLegno;
                }
            }

            if( this.capacitaPietra > this.civilta.risorse.pietra ){
                if( this.civilta.risorse.pietra + this.produzionePietra > this.capacitaPietra){
                    this.civilta.risorse.pietra = this.capacitaPietra;
                }else{
                    this.civilta.risorse.pietra = this.civilta.risorse.pietra + this.produzionePietra;
                }
            }

            var t = this;
            setTimeout(function(){ t.checkProduzione() }, 1000);
        },
        nuovoLogger (message) {
            var d = (new Date()).toISOString();
            this.logger.push(d+' - '+message);
        },
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
