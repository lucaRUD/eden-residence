/** Internal editorial evidence, not a set of approved building specifications.
 * Reviewed 2026-11-03. No third-party media is copied or embedded.
 */
export const passiveResearch = {
  reviewedAt: '2026-11-03',
  sources: {
    alphaUpdates: {
      url: 'https://www.linkedin.com/company/alphahome-ro/',
      access: 'Public company updates available through the search index; direct fetch unavailable.',
      supports: [
        'Eden-tagged updates name Sistema for heat-recovery ventilation and thermal installations.',
        'An Eden-tagged update describes underfloor cooling complemented by ventilation.',
        'An Eden-tagged update mentions Ortosil liquid waterproofing.',
        'Alpha Home describes its work around Passive House principles.',
      ],
    },
    alphaWebsite: { url: 'https://alpha-home.ro/', access: 'Redirected to a hosting account-suspension page; not used as evidence.' },
    phi: { url: 'https://passivehouse.com/en/home/building-certification/', supports: 'Five core principles; certification requires documented assessment, not a marketing description.' },
    ventilation: { url: 'https://passipedia.org/planning/building_services/ventilation/basics/types_of_ventilation', supports: 'Directed fresh/supply/extract/exhaust air and a plate exchanger with separate air passages.' },
    airtightness: { url: 'https://passipedia.org/construction/quality_assurance/airtightness_and_windtightness', supports: 'Reduced uncontrolled leakage, draughts and ventilation losses; airtightness requires adequate planned air exchange.' },
    comfort: { url: 'https://passipedia.org/basics/building_physics_-_basics/thermal_comfort', supports: 'Envelope and window quality support winter and summer comfort.' },
    surfaces: { url: 'https://passipedia.org/basics/building_physics_-_basics/thermal_comfort/thermal_comfort_parameters', supports: 'Interior surface temperatures affect perceived comfort.' },
    insulation: { url: 'https://passipedia.org/planning/thermal_protection/don_t_save_on_the_insulation', supports: 'Insulation reduces heat transfer and supports comfortable internal surfaces.' },
    summer: { url: 'https://passipedia.org/planning/summer_comfort/summer_comfort_guideline', supports: 'Summer comfort depends on solar gains, internal loads, ventilation strategy and climate-specific design.' },
    cooling: { url: 'https://passipedia.org/planning/refurbishment_with_passive_house_components/ak62solutions', supports: 'Radiant floor cooling is possible; dew point, humidity and the complete system design matter.' },
  },
  pending: [
    'Certification status and any claim to being the first Romanian passive apartment building.',
    'Final PHPP/energy calculations, airtightness tests and measured performance.',
    'Equipment manufacturers/models, filters, exchanger type, efficiencies, air volumes and routing.',
    'Underfloor cooling controls, dew-point protection and humidity/dehumidification strategy.',
    'Final partner responsibilities, contracts, product selections and commissioning.',
    'Material specifications and layer thicknesses; client approval of technical copy.',
  ],
  excludedClaims: [
    'The indexed 1 kW/apartment promotional figure is not used without engineering verification.',
    'No certification, savings percentages, guaranteed costs, airtightness results or installed equipment are asserted.',
  ],
  diagram: 'Original conceptual winter plate-exchanger teaching diagram. Not an Eden installation plan, equipment selection or a claim about the specified exchanger.',
} as const;
