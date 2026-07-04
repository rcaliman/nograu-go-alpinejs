package app.bikefit.util;

public class FitCalc {

    public static Double quadroSpeed(Double cavalo) {
        return cavalo * 0.67;
    }

    public static Double quadroMtb(Double cavalo) {
        return (cavalo * 0.67 - 10) * 0.393700787;
    }

    public static Double alturaSelim(Double cavalo) {
        return cavalo * 0.883;
    }

    public static Double topTubeEfetivo(Double cavalo, Double esterno, Double braco) {
        return ((esterno - cavalo + braco) / 2) + 4;
    }
}
