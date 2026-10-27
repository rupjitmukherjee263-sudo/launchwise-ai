import math
from typing import List
from app.schemas.financial import (
    FinancialInputs,
    FinancialReport,
    UnitEconomics,
    BreakEvenAnalysis,
    ScenarioMetrics,
    MonthlyProjection
)

class FinancialEngine:
    @staticmethod
    def calculate_unit_economics(selling_price: float, variable_cost: float) -> UnitEconomics:
        if selling_price <= 0:
            raise ValueError("Selling price must be greater than zero")
        
        contribution = round(selling_price - variable_cost, 2)
        margin_pct = round((contribution / selling_price) * 100.0, 2)
        
        if margin_pct >= 65.0:
            status = "Excellent Gross Margin (High Pricing Power)"
        elif margin_pct >= 40.0:
            status = "Healthy Gross Margin (Standard Viability)"
        elif margin_pct > 0:
            status = "Thin Gross Margin (High Volume Dependency)"
        else:
            status = "Negative Contribution (Unviable Pricing)"

        return UnitEconomics(
            selling_price=round(selling_price, 2),
            variable_cost_per_unit=round(variable_cost, 2),
            contribution_per_unit=contribution,
            contribution_margin_pct=margin_pct,
            gross_margin_status=status
        )

    @staticmethod
    def calculate_break_even(
        fixed_monthly_costs: float,
        selling_price: float,
        variable_cost: float,
        target_monthly_sales: int
    ) -> BreakEvenAnalysis:
        contribution = selling_price - variable_cost
        
        if contribution <= 0:
            return BreakEvenAnalysis(
                break_even_units=999999,
                break_even_revenue=99999999.0,
                target_monthly_sales=target_monthly_sales,
                is_attainable=False,
                margin_of_safety_units=-target_monthly_sales,
                margin_of_safety_pct=-100.0
            )

        if fixed_monthly_costs <= 0:
            be_units = 0
            be_revenue = 0.0
        else:
            be_units = math.ceil(fixed_monthly_costs / contribution)
            be_revenue = round(be_units * selling_price, 2)

        is_attainable = target_monthly_sales >= be_units
        safety_units = target_monthly_sales - be_units
        safety_pct = round((safety_units / max(1, target_monthly_sales)) * 100.0, 2)

        return BreakEvenAnalysis(
            break_even_units=be_units,
            break_even_revenue=be_revenue,
            target_monthly_sales=target_monthly_sales,
            is_attainable=is_attainable,
            margin_of_safety_units=safety_units,
            margin_of_safety_pct=safety_pct
        )

    @staticmethod
    def calculate_12_month_projections(
        inputs: FinancialInputs,
        volume_multiplier: float = 1.0,
        fixed_cost_multiplier: float = 1.0,
        variable_cost_multiplier: float = 1.0
    ) -> List[MonthlyProjection]:
        projections: List[MonthlyProjection] = []
        
        # Industry standard commercial ramp-up curve (months 1-6 ramp, 7-12 steady)
        ramp_rates = [0.40, 0.55, 0.70, 0.85, 0.95, 1.00, 1.00, 1.05, 1.05, 1.10, 1.10, 1.15]
        
        price = inputs.selling_price
        unit_var_cost = inputs.variable_cost_per_unit * variable_cost_multiplier
        monthly_fixed = inputs.fixed_monthly_costs * fixed_cost_multiplier
        tax_rate = inputs.tax_rate
        
        cumulative_cash = -inputs.initial_startup_investment

        for m_idx in range(12):
            month_num = m_idx + 1
            rate = ramp_rates[m_idx]
            units = math.ceil(inputs.target_monthly_sales * rate * volume_multiplier)
            
            rev = round(units * price, 2)
            var_cost = round(units * unit_var_cost, 2)
            gross = round(rev - var_cost, 2)
            op_profit = round(gross - monthly_fixed, 2)
            
            tax = round(max(0.0, op_profit * tax_rate), 2)
            net = round(op_profit - tax, 2)
            
            cumulative_cash = round(cumulative_cash + net, 2)

            projections.append(MonthlyProjection(
                month=month_num,
                units_sold=units,
                revenue=rev,
                variable_costs=var_cost,
                gross_profit=gross,
                fixed_costs=round(monthly_fixed, 2),
                operating_profit=op_profit,
                tax_amount=tax,
                net_profit=net,
                cumulative_cash_flow=cumulative_cash
            ))

        return projections

    @staticmethod
    def calculate_scenario_metrics(
        scenario_name: str,
        projections: List[MonthlyProjection],
        initial_investment: float,
        fixed_monthly: float,
        selling_price: float,
        unit_var_cost: float
    ) -> ScenarioMetrics:
        annual_units = sum(p.units_sold for p in projections)
        annual_rev = round(sum(p.revenue for p in projections), 2)
        annual_var = round(sum(p.variable_costs for p in projections), 2)
        annual_gross = round(sum(p.gross_profit for p in projections), 2)
        annual_fixed = round(sum(p.fixed_costs for p in projections), 2)
        annual_op = round(sum(p.operating_profit for p in projections), 2)
        annual_net = round(sum(p.net_profit for p in projections), 2)

        contribution = selling_price - unit_var_cost
        if contribution > 0 and fixed_monthly > 0:
            be_units = math.ceil(fixed_monthly / contribution)
            be_revenue = round(be_units * selling_price, 2)
        else:
            be_units = 999999
            be_revenue = 99999999.0

        # ROI % = Annual Net Profit / Initial Investment * 100
        roi_annual = round((annual_net / initial_investment) * 100.0, 2) if initial_investment > 0 else None

        # Cash Runway
        monthly_burn = max(1.0, fixed_monthly + (unit_var_cost * (annual_units / 12.0)) - (annual_rev / 12.0))
        runway = round(initial_investment / monthly_burn, 1) if monthly_burn > 0 and initial_investment > 0 else None

        # Payback period (first month cumulative cash flow turns positive)
        payback = None
        for p in projections:
            if p.cumulative_cash_flow >= 0:
                payback = float(p.month)
                break
        if payback is None and annual_net > 0:
            # Estimate beyond 12 months based on run rate
            months_needed = 12.0 + (abs(projections[-1].cumulative_cash_flow) / max(1.0, projections[-1].net_profit))
            payback = round(months_needed, 1)

        return ScenarioMetrics(
            scenario_name=scenario_name,
            annual_units=annual_units,
            annual_revenue=annual_rev,
            annual_variable_costs=annual_var,
            annual_gross_profit=annual_gross,
            annual_fixed_costs=annual_fixed,
            annual_operating_profit=annual_op,
            annual_net_profit=annual_net,
            break_even_units=be_units,
            break_even_revenue=be_revenue,
            roi_annual_pct=roi_annual,
            cash_runway_months=runway,
            payback_months=payback
        )

    @classmethod
    def run_full_model(cls, inputs: FinancialInputs) -> FinancialReport:
        unit_econ = cls.calculate_unit_economics(inputs.selling_price, inputs.variable_cost_per_unit)
        break_even = cls.calculate_break_even(
            inputs.fixed_monthly_costs,
            inputs.selling_price,
            inputs.variable_cost_per_unit,
            inputs.target_monthly_sales
        )

        # Projections
        base_projs = cls.calculate_12_month_projections(inputs, 1.0, 1.0, 1.0)
        cons_projs = cls.calculate_12_month_projections(inputs, volume_multiplier=0.70, fixed_cost_multiplier=1.15, variable_cost_multiplier=1.05)
        opt_projs = cls.calculate_12_month_projections(inputs, volume_multiplier=1.30, fixed_cost_multiplier=0.95, variable_cost_multiplier=0.92)

        base_scenario = cls.calculate_scenario_metrics("Base Case", base_projs, inputs.initial_startup_investment, inputs.fixed_monthly_costs, inputs.selling_price, inputs.variable_cost_per_unit)
        cons_scenario = cls.calculate_scenario_metrics("Conservative (-30% Vol, +15% Fixed)", cons_projs, inputs.initial_startup_investment, inputs.fixed_monthly_costs * 1.15, inputs.selling_price, inputs.variable_cost_per_unit * 1.05)
        opt_scenario = cls.calculate_scenario_metrics("Optimistic (+30% Vol, Scale Efficiency)", opt_projs, inputs.initial_startup_investment, inputs.fixed_monthly_costs * 0.95, inputs.selling_price, inputs.variable_cost_per_unit * 0.92)

        notes = [
            f"Gross contribution margin is {unit_econ.contribution_margin_pct}% (INR {unit_econ.contribution_per_unit} per unit).",
            f"Monthly break-even requires {break_even.break_even_units} units (INR {break_even.break_even_revenue:,.2f} revenue).",
            f"Target volume of {inputs.target_monthly_sales} units provides a {break_even.margin_of_safety_pct}% margin of safety.",
            "Projections incorporate a standard 6-month ramp-up curve (40% Month 1 to 100% Month 6).",
            "Taxes are computed at an effective 18% rate on positive monthly operating profit.",
            "Initial capital investment is amortized against cumulative cash flow across Year 1."
        ]

        return FinancialReport(
            unit_economics=unit_econ,
            break_even=break_even,
            conservative_scenario=cons_scenario,
            base_scenario=base_scenario,
            optimistic_scenario=opt_scenario,
            projections_12_months=base_projs,
            methodology_notes=notes
        )
