package app.pcd.service;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalculadoraFinanceiraService {

    private MessageSource messageSource;

    public double rate(int nper, double pmt, double pv) {

        double fv = 0;
        double guess = 0.01;
        double tol = 1e-6;
        int maxIter = 100;
        double r = guess;
        pmt = pmt * -1;

        for (int i = 0; i < maxIter; i++) {
            double f = pv * Math.pow(1 + r, nper) +
                    pmt * ((Math.pow(1 + r, nper) - 1) / r) +
                    fv;

            double fPrime = nper * pv * Math.pow(1 + r, nper - 1) +
                    pmt * ((nper * Math.pow(1 + r, nper - 1) * r - (Math.pow(1 + r, nper) - 1)) / (r * r));

            double newR = r - f / fPrime;
            if (Math.abs(newR - r) < tol) {
                return newR;
            }
            r = newR;
        }

        String erroRate = messageSource.getMessage("pcd.erro.rate", null, LocaleContextHolder.getLocale());

        throw new RuntimeException(erroRate);
    }

    public double pv(double rate, int nper, double pmt) {
        double fv = 0;
        if (rate == 0) {
            return -(fv + pmt * nper);
        }
        return -(fv + pmt * ((Math.pow(1 + rate, nper) - 1) / rate)) / Math.pow(1 + rate, nper);
    }

    public int calculaMeses(LocalDate dataInicio, LocalDate dataFim) {
        return (Period.between(dataInicio, dataFim).getMonths() +
                Period.between(dataInicio, dataFim).getYears() * 12) + 1;
    }
}
