const TYPES = {

  // domains
  ApplicationImageDomain: Symbol.for('ApplicationImageDomain'),
  ApplicationApplicantDomain: Symbol.for('ApplicationApplicantDomain'),
  ApplicationContactDomain: Symbol.for('ApplicationContactDomain'),
  CalculationServiceDomain: Symbol.for('CalculationServiceDomain'),

  // services
  ApplicationService: Symbol.for('ApplicationService'),
  ApplicationApplicantService: Symbol.for('ApplicationApplicantService'),
  ApplicationContactService: Symbol.for('ApplicationContactService'),
  ApplicationImageService: Symbol.for('ApplicationImageService'),
  TrademarkCategoriesService: Symbol.for('TrademarkCategoriesService'),
  AuthService: Symbol.for('AuthService'),
  PaymentService: Symbol.for('PaymentService'),
  CalculationService: Symbol.for('CalculationService'),

  // repositories
  ApplicationRepository: Symbol.for('ApplicationRepository'),
  ApplicationApplicantRepository: Symbol.for('ApplicationApplicantRepository'),
  ApplicationContactRepository: Symbol.for('ApplicationContactRepository'),
  ApplicationImageRepository: Symbol.for('ApplicationImageRepository'),

  // utils
  Configuration: Symbol.for('Configuration'),
  GCPLogger: Symbol.for('GCP Logger'),
  TypeormConfigUtil: Symbol.for('TypeormConfigUtil'),
  FileUtil: Symbol.for('FileUtil')
}

export { TYPES }
